import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ClientError, SanityDocument, Transaction} from '@sanity/client'
import {HttpError, MyEpic} from '@types'
import {bufferTime, catchError, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import {from, Observable, of} from 'rxjs'
import debugThrottle from '../../operators/debugThrottle'
import {COLLABORATION_DOCUMENT_NAME} from '../../constants'
import {RootReducerState} from '../types'
import groq from 'groq'
import {checkCollaborationName} from '../../operators/checkTagName'
import {Asset} from '../../types'

type CollaborationReducerState = {
  creating: boolean
  creatingError?: HttpError
  fetching: boolean
  fetchingError?: HttpError
  byIds: Record<string, CollaborationItem>
  panelVisible: boolean
  fetchCount: number
  allIds: string[]
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
  byIds: {},
  panelVisible: false,
  fetchCount: -1,
  allIds: []
}

const collaborationSlice = createSlice({
  name: 'collaborations',
  initialState,
  reducers: {
    // Create collaboration
    createRequest(state, _action: PayloadAction<{name: string; assetId?: string}>) {
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
      const {collaborations} = action.payload
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

      collaborations?.forEach((collaboration: Collaboration) => {
        state.allIds.push(collaboration._id)
        state.byIds[collaboration._id] = {
          _type: 'collaborationItem',
          picked: false,
          collaboration,
          updating: false
        }
      })

      state.fetching = false
      state.fetchCount = collaborations.length || 0
      delete state.fetchingError
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
    updateCollaborationItemRequest(
      state,
      action: PayloadAction<{
        closeDialogId?: string
        formData: Record<string, any>
        collaboration: Collaboration
      }>
    ) {
      const {collaboration} = action.payload
      state.byIds[collaboration?._id].updating = true
    },
    updateComplete(
      state,
      action: PayloadAction<{collaboration: Collaboration; closeDialogId?: string}>
    ) {
      const {collaboration} = action.payload
      state.byIds[collaboration._id].updating = false
      state.byIds[collaboration._id].collaboration = collaboration
    },
    updateError(state, action: PayloadAction<{collaboration: Collaboration; error: HttpError}>) {
      const {error, collaboration} = action.payload
      const collaborationId = collaboration?._id
      state.byIds[collaborationId].error = error
      state.byIds[collaborationId].updating = false
    },
    deleteRequest(state, action: PayloadAction<{collaboration: Collaboration}>) {
      const collaborationId = action.payload?.collaboration?._id
      state.byIds[collaborationId].picked = false
      state.byIds[collaborationId].updating = true

      Object.keys(state.byIds).forEach(key => {
        delete state.byIds[key].error
      })
    },
    deleteComplete(state, action: PayloadAction<{collaborationId: string}>) {
      const {collaborationId} = action.payload
      const deleteIndex = state.allIds.indexOf(collaborationId)
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1)
      }
      delete state.byIds[collaborationId]
    },
    deleteError(state, action: PayloadAction<{error: HttpError; collaboration: Collaboration}>) {
      const {error, collaboration} = action.payload
      const collaborationId = collaboration?._id
      state.byIds[collaborationId].error = error
      state.byIds[collaborationId].updating = false
    },
    // Set tag panel visibility
    panelVisibleSet(state, action: PayloadAction<{panelVisible: boolean}>) {
      const {panelVisible} = action.payload
      state.panelVisible = panelVisible
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

// On collaboration update request
// - check if collaboration name already exists
// - throw if collaboration already exists
// - otherwise, patch document
export const collaborationUpdateEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(collaborationSlice.actions.updateCollaborationItemRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {closeDialogId, formData, collaboration} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Check if collaboration name is available, throw early if not
        checkCollaborationName(client, formData?.name?.current),
        // Patch document (Update collaboration)
        mergeMap(
          () =>
            from(
              client
                .patch(collaboration._id)
                .set({name: {_type: 'slug', current: formData?.name.current}})
                .commit()
            ) as Observable<Collaboration>
        ),
        // Dispatch complete action
        mergeMap((updatedCollaboration: Collaboration) => {
          return of(
            collaborationSlice.actions.updateComplete({
              closeDialogId,
              collaboration: updatedCollaboration
            })
          )
        }),
        catchError((error: ClientError) =>
          of(
            collaborationSlice.actions.updateError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              collaboration
            })
          )
        )
      )
    })
  )

export const collaborationsDeleteEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(collaborationActions.deleteRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      //@ts-ignore
      const {collaboration} = action.payload
      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Fetch assets which reference this tag
        mergeMap(() =>
          client.observable.fetch<Asset[]>(
            groq`*[
              _type in ["sanity.fileAsset", "sanity.imageAsset"]
              && references(*[_type == "collaboration" && name.current == $collaboration]._id)
            ] {
              _id,
              _rev,
              opt
            }`,
            {collaboration: collaboration?.name?.current ?? null}
          )
        ),
        // Create transaction which remove collaboration references from all matched assets and delete tag
        mergeMap(assets => {
          const patches = assets.map(asset => ({
            id: asset._id,
            patch: {
              // this will cause the transaction to fail if the document has been modified since it was fetched.
              ifRevisionID: asset._rev,
              unset: [`collaboration[_ref == "${collaboration._id}"]`],
              set: {collaboration: null}
            }
          }))
          const transaction: Transaction = patches.reduce(
            (tx, patch) => tx.patch(patch.id, patch.patch),
            client.transaction()
          )

          transaction.delete(collaboration._id)

          return from(transaction.commit())
        }),
        // Dispatch complete action
        mergeMap(() =>
          of(collaborationSlice.actions.deleteComplete({collaborationId: collaboration._id}))
        ),
        catchError((error: ClientError) =>
          of(
            collaborationSlice.actions.deleteError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              collaboration: collaboration
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

export const selectCollaborationById = createSelector(
  [
    selectCollaborationsByIds,
    (_state: RootReducerState, collaborationId: string) => collaborationId
  ],
  (byIds, collaborationId) => byIds[collaborationId]
)

export const selectCollaborations = createSelector(selectCollaborationsByIds, byIds =>
  Object.values(byIds)
)

export const selectInitialSelectedCollaboration = (asset?: Asset) =>
  createSelector(selectCollaborations, collaborations => {
    const selectedCollaboration = asset?.collaboration?._ref ?? asset?.collaboration?._id
    const collaboration = collaborations.find(
      collaborationItem => collaborationItem.collaboration._id === selectedCollaboration
    )
    if (collaboration?.collaboration?.name?.current && collaboration?.collaboration?._id) {
      return {
        label: collaboration?.collaboration?.name?.current ?? '',
        value: collaboration?.collaboration?._id ?? ''
      }
    }
    return null
  })

export const selectCollaborationsById = createSelector(selectCollaborationsByIds, byIds => byIds)

export const collaborationActions = collaborationSlice.actions

export default collaborationSlice.reducer
