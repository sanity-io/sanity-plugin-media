import {Tag} from '@types'
import groq from 'groq'
import produce from 'immer'
import client from 'part:@sanity/base/client'
import {StateObservable} from 'redux-observable'
import {Observable, from, of} from 'rxjs'
import {catchError, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import {isOfType} from 'typesafe-actions'

import {
  TagsActions,
  TagsCreateCompleteAction,
  TagsCreateErrorAction,
  TagsCreateRequestAction,
  TagsDeleteCompleteAction,
  TagsDeleteErrorAction,
  TagsDeleteRequestAction,
  TagsFetchCompleteAction,
  TagsFetchErrorAction,
  TagsFetchRequestAction,
  TagsListenerDeleteAction,
  TagsListenerUpdateAction,
  TagsReducerState
} from './types'
import debugThrottle from '../../operators/debugThrottle'
import {RootReducerState} from '../types'

/***********
 * ACTIONS *
 ***********/

export enum TagsActionTypes {
  CREATE_COMPLETE = 'TAGS_CREATE_COMPLETE',
  CREATE_ERROR = 'TAGS_CREATE_ERROR',
  CREATE_REQUEST = 'TAGS_CREATE_REQUEST',
  DELETE_COMPLETE = 'TAGS_DELETE_COMPLETE',
  DELETE_ERROR = 'TAGS_DELETE_ERROR',
  DELETE_REQUEST = 'TAGS_DELETE_REQUEST',
  FETCH_COMPLETE = 'TAGS_FETCH_COMPLETE',
  FETCH_ERROR = 'TAGS_FETCH_ERROR',
  FETCH_REQUEST = 'TAGS_FETCH_REQUEST',
  LISTENER_DELETE = 'TAGS_LISTENER_DELETE',
  LISTENER_UPDATE = 'TAGS_LISTENER_UPDATE'
}

/***********
 * REDUCER *
 ***********/

/**
 * `allIds` is an ordered array of all tag ids
 * `byIds` is an object literal that contains all normalised tags (with tag IDs as keys)
 */

export const initialState: TagsReducerState = {
  allIds: [],
  byIds: {},
  creating: false,
  creatingError: null,
  fetchCount: -1,
  fetching: false,
  fetchingError: null
  // totalCount: -1
}

export default function tagsReducerState(
  state: TagsReducerState = initialState,
  action: TagsActions
): TagsReducerState {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      /**
       * A tag has been successfully created via the client.
       * - Add tag from the redux store (both the normalised object and ordered tag id).
       */
      case TagsActionTypes.CREATE_COMPLETE: {
        const tag = action.payload.tag
        draft.creating = false

        // Add normalised tag item
        draft.byIds[tag._id] = {
          picked: false,
          tag,
          updating: false
        }

        // Add tag ID and re-order by name (asc)
        draft.allIds = [...draft.allIds, tag._id].sort((a, b) => {
          const tagA = draft.byIds[a].tag
          const tagB = draft.byIds[b].tag

          if (tagA.name < tagB.name) {
            return -1
          } else if (tagA.name > tagB.name) {
            return 1
          } else {
            return 1
          }
        })

        break
      }

      /**
       * A tag was unable to be created via the client.
       */
      case TagsActionTypes.CREATE_ERROR:
        draft.creating = false
        draft.creatingError = action.payload.error
        break

      /**
       * A request to create a tag has been made (and not yet completed).
       */
      case TagsActionTypes.CREATE_REQUEST:
        draft.creating = true
        draft.creatingError = null
        break

      /**
       * A tag has been successfully deleted via the client.
       * - Delete tag from the redux store (both the normalised object and ordered tag id).
       */
      case TagsActionTypes.DELETE_COMPLETE: {
        const tagId = action.payload?.tagId
        const deleteIndex = draft.allIds.indexOf(tagId)
        if (deleteIndex > 0) {
          draft.allIds.splice(deleteIndex, 1)
        }
        delete draft.byIds[tagId]
        break
      }
      /**
       * A tag was unable to be deleted via the client.
       * - Store the error code on tag in question to optionally display to the user.
       * - Clear updating status on tag in question.
       */
      case TagsActionTypes.DELETE_ERROR: {
        const tagId = action.payload?.tag?._id
        const errorCode = action.payload?.error?.statusCode
        draft.byIds[tagId].errorCode = errorCode
        draft.byIds[tagId].updating = false
        break
      }
      /**
       * A request to delete a tag has been made (and not yet completed).
       * - Set updating and clear picked status on target tag.
       * - Clear any existing tag errors.
       */
      case TagsActionTypes.DELETE_REQUEST: {
        const tagId = action.payload?.tag?._id
        draft.byIds[tagId].picked = false
        draft.byIds[tagId].updating = true

        Object.keys(draft.byIds).forEach(key => {
          delete draft.byIds[key].errorCode
        })

        break
      }
      /**
       * A request to fetch tags has succeeded.
       * - Add all fetched tags as normalised objects, and store tag IDs in a separate ordered array.
       */
      case TagsActionTypes.FETCH_COMPLETE: {
        const tags = action.payload?.tags || []

        if (tags) {
          tags.forEach(tag => {
            draft.allIds.push(tag._id)
            draft.byIds[tag._id] = {
              picked: false,
              tag,
              updating: false
            }
          })
        }

        draft.fetching = false
        draft.fetchCount = tags.length || 0
        draft.fetchingError = null
        break
      }
      /**
       * A request to fetch tags has failed.
       * - Clear fetching status
       * - Store error status
       */
      case TagsActionTypes.FETCH_ERROR: {
        draft.fetching = false
        draft.fetchingError = true
        break
      }

      /**
       * A request to fetch tag has been made (and not yet completed)
       * - Set fetching status
       * - Clear any previously stored error
       */
      case TagsActionTypes.FETCH_REQUEST:
        draft.fetching = true
        draft.fetchingError = null
        break

      /**
       * A tag has been successfully deleted via the client.
       * - Delete tag from the redux store (both the normalised object and ordered tag ID).
       */
      case TagsActionTypes.LISTENER_DELETE: {
        const tagId = action.payload?.tagId
        const deleteIndex = draft.allIds.indexOf(tagId)
        if (deleteIndex > 0) {
          draft.allIds.splice(deleteIndex, 1)
        }
        delete draft.byIds[tagId]
        break
      }

      /**
       * A tag has been successfully updated via the client.
       * - Update tag in `byIds`
       */
      case TagsActionTypes.LISTENER_UPDATE: {
        const tag = action.payload?.tag
        if (draft.byIds[tag._id]) {
          draft.byIds[tag._id].tag = tag
        }
        break
      }
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// Create started
export const tagsCreate = (name: string): TagsCreateRequestAction => ({
  payload: {name},
  type: TagsActionTypes.CREATE_REQUEST
})

// Create success
export const tagsCreateComplete = (tag: Tag): TagsCreateCompleteAction => ({
  payload: {tag},
  type: TagsActionTypes.CREATE_COMPLETE
})

// Create error
export const tagsCreateError = (name: string, error: any): TagsCreateErrorAction => ({
  payload: {error, name},
  type: TagsActionTypes.CREATE_ERROR
})

// Delete started
export const tagsDelete = (tag: Tag): TagsDeleteRequestAction => ({
  payload: {tag},
  type: TagsActionTypes.DELETE_REQUEST
})

// Delete success
export const tagsDeleteComplete = (tagId: string): TagsDeleteCompleteAction => ({
  payload: {tagId},
  type: TagsActionTypes.DELETE_COMPLETE
})

// Delete error
export const tagsDeleteError = (tag: Tag, error: any): TagsDeleteErrorAction => ({
  payload: {error, tag},
  type: TagsActionTypes.DELETE_ERROR
})

/**
 * Start fetch with GROQ query
 */
export const tagsFetch = (): TagsFetchRequestAction => {
  // Construct query
  const query = groq`
    {
      "items": *[
        _type == "mediaTag"
        && !(_id in path("drafts.**"))
      ] {
        _createdAt,
        _updatedAt,
        _id,
        _rev,
        _type,
        'name': name.current
      } | order(name.current asc),
    }
  `

  return {
    payload: {query},
    type: TagsActionTypes.FETCH_REQUEST
  }
}

// Fetch complete
export const tagsFetchComplete = (tags: Tag[]): TagsFetchCompleteAction => ({
  payload: {tags},
  type: TagsActionTypes.FETCH_COMPLETE
})

// Fetch failed
export const tagsFetchError = (error: any): TagsFetchErrorAction => ({
  payload: {error},
  type: TagsActionTypes.FETCH_ERROR
})

// Tag deleted via listener
export const tagsListenerDelete = (tagId: string): TagsListenerDeleteAction => ({
  payload: {tagId},
  type: TagsActionTypes.LISTENER_DELETE
})

// Tag updated via listener
export const tagsListenerUpdate = (tag: Tag): TagsListenerUpdateAction => ({
  payload: {tag},
  type: TagsActionTypes.LISTENER_UPDATE
})

/*********
 * EPICS *
 *********/

/**
 * List for tag create requests:
 * - make async call to `client.create`
 * - return a corresponding success or error action
 */
export const tagsCreateEpic = (
  action$: Observable<TagsActions>,
  state$: StateObservable<RootReducerState>
): Observable<TagsActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.CREATE_REQUEST)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {name} = action.payload

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          from(
            client.create({
              _type: 'mediaTag',
              name: {
                _type: 'slug',
                current: name
              }
            })
          )
        ),
        // TODO: type correctly
        mergeMap((result: any) => {
          const tag = {
            ...result,
            name: result?.name?.current
          }
          return of(tagsCreateComplete(tag))
        }),
        catchError(error => of(tagsCreateError(name, error)))
      )
    })
  )

/**
 * List for tag delete requests:
 * - make async call to `client.delete`
 * - return a corresponding success or error action
 */
export const tagsDeleteEpic = (
  action$: Observable<TagsActions>,
  state$: StateObservable<RootReducerState>
): Observable<TagsActions> => {
  return action$.pipe(
    filter(isOfType(TagsActionTypes.DELETE_REQUEST)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {tag} = action.payload
      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => from(client.delete(tag._id))),
        mergeMap(() => of(tagsDeleteComplete(tag._id))),
        catchError(error => of(tagsDeleteError(tag, error)))
      )
    })
  )
}

/**
 * Listen for fetch requests:
 * - make async call to `client.fetch`
 * - return a corresponding success or error action
 */
export const tagsFetchEpic = (
  action$: Observable<TagsActions>,
  state$: StateObservable<RootReducerState>
): Observable<TagsActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.FETCH_REQUEST)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const params = action.payload?.params
      const query = action.payload?.query

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => from(client.fetch(query, params))),
        mergeMap((result: any) => {
          const {
            items
            // totalCount
          } = result

          return of(tagsFetchComplete(items))
        }),
        catchError(error => of(tagsFetchError(error)))
      )
    })
  )
