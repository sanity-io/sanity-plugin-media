import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ClientError, SanityDocument} from '@sanity/client'
import {HttpError, MyEpic} from '@types'
import {bufferTime, catchError, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import {of} from 'rxjs'
import debugThrottle from '../../operators/debugThrottle'
import {SEASONS_DOCUMENT_NAME} from '../../constants'
import {RootReducerState} from '../types'
import groq from 'groq'

type SeasonReducerState = {
  creating: boolean
  creatingError?: HttpError
  fetching: boolean
  fetchingError?: HttpError
  byIds: Record<string, SeasonItem>
}

export type Season = SanityDocument & {
  name: {
    _type: 'slug'
    current: string
  }
}

export type SeasonItem = {
  _type: 'seasonItem'
  season: Season
  error?: HttpError
  picked: boolean
  updating: boolean
}

const initialState: SeasonReducerState = {
  creating: false,
  fetching: false,
  fetchingError: undefined,
  creatingError: undefined,
  byIds: {}
}

const seasonsSlice = createSlice({
  name: 'seasons',
  initialState,
  reducers: {
    // Create season
    createRequest(state, _action: PayloadAction<{name: string}>) {
      state.creating = true
      delete state.creatingError
    },
    createComplete(state, action: PayloadAction<{season: Season}>) {
      const {season} = action.payload
      state.creating = false
      state.byIds[season._id] = {
        _type: 'seasonItem',
        error: undefined,
        picked: false,
        season,
        updating: false
      }
    },
    createError(state, action: PayloadAction<{error: HttpError; name: string}>) {
      state.creating = false
      state.creatingError = action.payload.error
    },
    // Queue batch tag creation
    listenerCreateQueue(_state, _action: PayloadAction<{tag: Season}>) {
      //
    },
    // Fetch seasons
    fetchRequest: {
      reducer: (state, _action: PayloadAction<{query: string}>) => {
        state.fetching = true
        delete state.fetchingError
      },
      prepare: () => {
        // Construct query
        const query = groq`
          {
            "items": *[
              _type == "${SEASONS_DOCUMENT_NAME}"
              && !(_id in path("drafts.**"))
            ] {
              _createdAt,
              _updatedAt,
              _id,
              _rev,
              _type,
              name
            } | order(name.current asc),
          }
        `
        return {payload: {query}}
      }
    },

    fetchComplete(state, action) {
      state.fetching = false
      state.fetchingError = undefined

      state.byIds = action.payload.seasons.reduce((acc: Season, season: Season) => {
        acc[season._id] = {
          _type: 'seasonItem',
          error: undefined,
          picked: false,
          season,
          updating: false
        }
        return acc
      }, {} as Record<string, SeasonItem>)
    },
    fetchError(state, action: PayloadAction<{error: HttpError}>) {
      const {error} = action.payload
      state.fetching = false
      state.fetchingError = error
    },
    listenerCreateQueueComplete(state, action: PayloadAction<{seasons: Season[]}>) {
      const {seasons} = action.payload

      seasons?.forEach(season => {
        state.byIds[season._id] = {
          _type: 'seasonItem',
          picked: false,
          season,
          updating: false
        }
      })
    },
    // Update season
    updateRequest(state, action: PayloadAction<{season: Season}>) {
      const {season} = action.payload
      state.byIds[season._id].updating = true
    },
    updateComplete(state, action: PayloadAction<{season: Season}>) {
      const {season} = action.payload
      state.byIds[season._id].updating = false
      state.byIds[season._id].season = season
    },
    updateError(state, action: PayloadAction<{season: Season; error: HttpError}>) {
      const {error, season} = action.payload
      const seasonId = season?._id
      state.byIds[seasonId].error = error
      state.byIds[seasonId].updating = false
    }
  }
})

// Async fetch seasons
export const seasonsFetchEpic: MyEpic = (action$, state$, {client}) => {
  return action$.pipe(
    filter(seasonsSlice.actions.fetchRequest.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const {query} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Fetch seasons
        mergeMap(() =>
          client.observable.fetch<{
            items: Season[]
          }>(query)
        ),
        // Dispatch complete action
        mergeMap(result => {
          const {items} = result
          return of(seasonsSlice.actions.fetchComplete({seasons: items}))
        }),
        catchError((error: ClientError) =>
          of(
            seasonsSlice.actions.fetchError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              }
            })
          )
        )
      )
    })
  )
}

export const seasonsCreateEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(seasonsSlice.actions.createRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {name} = action.payload

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          client.observable.create({
            _type: SEASONS_DOCUMENT_NAME,
            name: {
              _type: 'slug',
              current: name
            }
          })
        ),
        mergeMap(result => of(seasonsSlice.actions.createComplete({season: result as Season}))),
        catchError((error: ClientError) =>
          of(
            seasonsSlice.actions.createError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              name
            })
          )
        )
      )
    })
  )

// Buffer tag creation via sanity subscriber
export const seasonsListenerCreateQueueEpic: MyEpic = action$ =>
  action$.pipe(
    filter(seasonsSlice.actions.listenerCreateQueue.match),
    bufferTime(2000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const seasons = actions?.map(action => action.payload.tag)
      return of(seasonsSlice.actions.listenerCreateQueueComplete({seasons}))
    })
  )

// Selectors
const selectTagsByIds = (state: RootReducerState) => state.seasons.byIds

export const selectSeasons = createSelector(selectTagsByIds, byIds => Object.values(byIds))

export const selectSeasonsById = createSelector(selectTagsByIds, byIds => byIds)

export const seasonActions = seasonsSlice.actions

export default seasonsSlice.reducer
