import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ClientError, SanityDocument} from '@sanity/client'
import {HttpError, MyEpic} from '@types'
import {bufferTime, catchError, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import {of} from 'rxjs'
import debugThrottle from '../../operators/debugThrottle'
import {COLLABORATION_DOCUMENT_NAME} from '../../constants'
import {RootReducerState} from '../types'
import groq from 'groq'

type CollaborationReducerState = {
  creating: boolean
  creatingError?: HttpError
  fetching: boolean
  fetchingError?: HttpError
  byIds: Record<string, CollaborationItem>
}

export type Collaboration = SanityDocument & {
  name: {
    _type: 'slug'
    current: string
  }
}

export type CollaborationItem = {
  _type: 'collaborationItem'
  collaboration: Collaboration
  error?: HttpError
  picked: boolean
  updating: boolean
}

const initialState: CollaborationReducerState = {
  creating: false,
  fetching: false,
  fetchingError: undefined,
  creatingError: undefined,
  byIds: {}
}

const collaborationSlice = createSlice({
  name: 'collaborations',
  initialState,
  reducers: {
    // Create collaboration
    createRequest(state, _action: PayloadAction<{name: string}>) {
      state.creating = true
      delete state.creatingError
    },
    createComplete(state, action: PayloadAction<{collaboration: Collaboration}>) {
      const {collaboration} = action.payload
      state.creating = false
      state.byIds[collaboration._id] = {
        _type: 'collaborationItem',
        error: undefined,
        picked: false,
        collaboration,
        updating: false
      }
    },
    createError(state, action: PayloadAction<{error: HttpError; name: string}>) {
      state.creating = false
      state.creatingError = action.payload.error
    },
    // Queue batch tag creation
    listenerCreateQueue(_state, _action: PayloadAction<{collaboration: Collaboration}>) {
      //
    },
    // Fetch collaborations
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
              _type == "${COLLABORATION_DOCUMENT_NAME}"
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

      state.byIds = action.payload.collaborations.reduce(
        (acc: Collaboration, collaboration: Collaboration) => {
          acc[collaboration._id] = {
            _type: 'collaborationItem',
            error: undefined,
            picked: false,
            collaboration,
            updating: false
          }
          return acc
        },
        {} as Record<string, CollaborationItem>
      )
    },
    fetchError(state, action: PayloadAction<{error: HttpError}>) {
      const {error} = action.payload
      state.fetching = false
      state.fetchingError = error
    },
    listenerCreateQueueComplete(state, action: PayloadAction<{collaborations: Collaboration[]}>) {
      const {collaborations} = action.payload

      collaborations?.forEach(collaboration => {
        state.byIds[collaboration._id] = {
          _type: 'collaborationItem',
          picked: false,
          collaboration,
          updating: false
        }
      })
    },
    // Update collaboration
    updateRequest(state, action: PayloadAction<{collaboration: Collaboration}>) {
      const {collaboration} = action.payload
      state.byIds[collaboration._id].updating = true
    },
    updateComplete(state, action: PayloadAction<{collaboration: Collaboration}>) {
      const {collaboration} = action.payload
      state.byIds[collaboration._id].updating = false
      state.byIds[collaboration._id].collaboration = collaboration
    },
    updateError(state, action: PayloadAction<{collaboration: Collaboration; error: HttpError}>) {
      const {error, collaboration} = action.payload
      const collaborationId = collaboration?._id
      state.byIds[collaborationId].error = error
      state.byIds[collaborationId].updating = false
    }
  }
})

// Async fetch collaboration
export const collaborationFetchEpic: MyEpic = (action$, state$, {client}) => {
  return action$.pipe(
    filter(collaborationSlice.actions.fetchRequest.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const {query} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Fetch collaborations
        mergeMap(() =>
          client.observable.fetch<{
            items: Collaboration[]
          }>(query)
        ),
        // Dispatch complete action
        mergeMap(result => {
          const {items} = result

          return of(collaborationSlice.actions.fetchComplete({collaborations: items}))
        }),
        catchError((error: ClientError) =>
          of(
            collaborationSlice.actions.fetchError({
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

export const collaborationsCreateEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(collaborationSlice.actions.createRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {name} = action.payload

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          client.observable.create({
            _type: COLLABORATION_DOCUMENT_NAME,
            name: {
              _type: 'slug',
              current: name
            }
          })
        ),
        mergeMap(result =>
          of(collaborationSlice.actions.createComplete({collaboration: result as Collaboration}))
        ),
        catchError((error: ClientError) =>
          of(
            collaborationSlice.actions.createError({
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
export const collaborationsListenerCreateQueueEpic: MyEpic = action$ =>
  action$.pipe(
    filter(collaborationSlice.actions.listenerCreateQueue.match),
    bufferTime(2000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const collaborations = actions?.map(action => action.payload.collaboration)
      return of(collaborationSlice.actions.listenerCreateQueueComplete({collaborations}))
    })
  )

// Selectors
const selectCollaborationsByIds = (state: RootReducerState) => state.collaborations.byIds

export const selectCollaborations = createSelector(selectCollaborationsByIds, byIds =>
  Object.values(byIds)
)

export const selectCollaborationsById = createSelector(selectCollaborationsByIds, byIds => byIds)

export const collaborationActions = collaborationSlice.actions

export default collaborationSlice.reducer
