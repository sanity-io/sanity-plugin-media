import {createSelector} from '@reduxjs/toolkit'
import {ClientError, Transaction} from '@sanity/client'
import {Asset, HttpError, ReactSelectOption, Tag, TagItem} from '@types'
import groq from 'groq'
import produce from 'immer'
import client from 'part:@sanity/base/client'
import {StateObservable} from 'redux-observable'
import {Observable, from, of} from 'rxjs'
import {catchError, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import {isOfType} from 'typesafe-actions'

import {TAG_DOCUMENT_NAME} from '../../constants'
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
  TagsListenerCreateAction,
  TagsListenerDeleteAction,
  TagsListenerUpdateAction,
  TagsPanelVisibleSetAction,
  TagsReducerState,
  TagsSortAction,
  TagsUpdateCompleteAction,
  TagsUpdateRequestAction,
  TagsUpdateErrorAction
} from './types'
import debugThrottle from '../../operators/debugThrottle'
import {RootReducerState} from '../types'
import getTagSelectOptions from '../../utils/getTagSelectOptions'
import {Selector} from 'react-redux'
import {DialogActions} from '../dialog/types'
import {DialogActionTypes} from '../dialog'
import checkTagName from '../../operators/checkTagName'

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
  LISTENER_CREATE = 'TAGS_LISTENER_CREATE',
  LISTENER_DELETE = 'TAGS_LISTENER_DELETE',
  LISTENER_UPDATE = 'TAGS_LISTENER_UPDATE',
  PANEL_VISIBLE_SET = 'TAGS_PANEL_VISIBLE_SET',
  SORT = 'TAGS_SORT',
  UPDATE_COMPLETE = 'TAGS_UPDATE_COMPLETE',
  UPDATE_ERROR = 'TAGS_UPDATE_ERROR',
  UPDATE_REQUEST = 'TAGS_UPDATE_REQUEST'
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
  creatingError: undefined,
  fetchCount: -1,
  fetching: false,
  fetchingError: undefined,
  panelVisible: true
}

export default function tagsReducerState(
  state: TagsReducerState = initialState,
  action: DialogActions | TagsActions
): TagsReducerState {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // Create tag creation errors when tag create form is displayed
      case DialogActionTypes.SHOW_TAG_CREATE:
        delete draft.creatingError
        break

      // Clear tag errors when tag edit form is displayed
      case DialogActionTypes.SHOW_TAG_EDIT: {
        const {tagId} = action.payload
        delete draft.byIds[tagId].error
        break
      }

      /**
       * A tag has been successfully created via the client.
       * - Add tag from the redux store (both the normalised object and ordered tag id).
       */
      case TagsActionTypes.CREATE_COMPLETE: {
        draft.creating = false
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
        delete draft.creatingError
        break

      /**
       * A tag has been successfully deleted via the client.
       * - Delete tag from the redux store (both the normalised object and ordered tag id).
       */
      case TagsActionTypes.DELETE_COMPLETE: {
        const tagId = action.payload?.tagId
        const deleteIndex = draft.allIds.indexOf(tagId)
        if (deleteIndex >= 0) {
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
        const {error, tag} = action.payload

        const tagId = tag?._id
        draft.byIds[tagId].error = error
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
          delete draft.byIds[key].error
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
        delete draft.fetchingError
        break
      }
      /**
       * A request to fetch tags has failed.
       * - Clear fetching status
       * - Store error status
       */
      case TagsActionTypes.FETCH_ERROR: {
        draft.fetching = false
        draft.fetchingError = action.payload.error
        break
      }

      /**
       * A request to fetch tag has been made (and not yet completed)
       * - Set fetching status
       * - Clear any previously stored error
       */
      case TagsActionTypes.FETCH_REQUEST:
        draft.fetching = true
        delete draft.fetchingError
        break

      /**
       * A tag has been successfully created via the client.
       * - Add tag from the redux store (normalised object).
       */
      case TagsActionTypes.LISTENER_CREATE: {
        const tag = action.payload.tag

        // Add normalised tag item
        draft.byIds[tag._id] = {
          picked: false,
          tag,
          updating: false
        }

        // Add tag ID
        draft.allIds.push(tag._id)
        break
      }

      /**
       * A tag has been successfully deleted via the client.
       * - Delete tag from the redux store (both the normalised object and ordered tag ID).
       */
      case TagsActionTypes.LISTENER_DELETE: {
        const tagId = action.payload?.tagId
        const deleteIndex = draft.allIds.indexOf(tagId)
        if (deleteIndex >= 0) {
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

      case TagsActionTypes.PANEL_VISIBLE_SET: {
        draft.panelVisible = action.payload?.panelVisible
        break
      }

      case TagsActionTypes.SORT:
        draft.allIds.sort((a, b) => {
          const tagA = draft.byIds[a].tag.name.current
          const tagB = draft.byIds[b].tag.name.current

          if (tagA < tagB) {
            return -1
          } else if (tagA > tagB) {
            return 1
          } else {
            return 0
          }
        })
        break

      /**
       * A tag has been successfully updated via the client.
       * - Update asset in `byIds`
       */
      case TagsActionTypes.UPDATE_COMPLETE: {
        const tagId = action.payload?.tagId
        draft.byIds[tagId].updating = false
        break
      }

      /**
       * A tag was unable to be updated via the client.
       * - Store the error code on asset in question to optionally display to the user.
       * - Clear updating status on asset in question.
       */
      case TagsActionTypes.UPDATE_ERROR: {
        const {error, tag} = action.payload
        const tagId = tag?._id
        draft.byIds[tagId].error = error
        draft.byIds[tagId].updating = false
        break
      }

      /**
       * A request to update a tag has been made (and not yet completed).
       * - Set updating status on target asset.
       * - Clear any existing asset errors.
       */
      case TagsActionTypes.UPDATE_REQUEST: {
        const tagId = action.payload?.tag?._id
        draft.byIds[tagId].updating = true
        break
      }
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// Create started
export const tagsCreate = ({
  assetId,
  name
}: {
  assetId?: string
  name: string
}): TagsCreateRequestAction => ({
  payload: {assetId, name},
  type: TagsActionTypes.CREATE_REQUEST
})

// Create success
export const tagsCreateComplete = ({
  assetId,
  tag
}: {
  assetId?: string
  tag: Tag
}): TagsCreateCompleteAction => ({
  payload: {assetId, tag},
  type: TagsActionTypes.CREATE_COMPLETE
})

// Create error
export const tagsCreateError = ({
  error,
  name
}: {
  name: string
  error: HttpError
}): TagsCreateErrorAction => ({
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
export const tagsDeleteError = ({
  error,
  tag
}: {
  error: HttpError
  tag: Tag
}): TagsDeleteErrorAction => ({
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
        _type == "${TAG_DOCUMENT_NAME}"
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
export const tagsFetchError = (error: HttpError): TagsFetchErrorAction => ({
  payload: {error},
  type: TagsActionTypes.FETCH_ERROR
})

// Tag created via listener
export const tagsListenerCreate = (tag: Tag): TagsListenerCreateAction => ({
  payload: {tag},
  type: TagsActionTypes.LISTENER_CREATE
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

export const tagsPanelVisibleSet = (panelVisible: boolean): TagsPanelVisibleSetAction => ({
  payload: {panelVisible},
  type: TagsActionTypes.PANEL_VISIBLE_SET
})

// Sort tags
export const tagsSort = (): TagsSortAction => ({
  type: TagsActionTypes.SORT
})

// Update started
export const tagsUpdate = ({
  closeDialogId,
  formData,
  tag
}: {
  closeDialogId?: string
  formData: Record<string, any>
  tag: Tag
}): TagsUpdateRequestAction => ({
  payload: {
    closeDialogId,
    formData,
    tag
  },
  type: TagsActionTypes.UPDATE_REQUEST
})

// Delete success
export const tagsUpdateComplete = ({
  closeDialogId,
  tagId
}: {
  closeDialogId?: string
  tagId: string
}): TagsUpdateCompleteAction => ({
  payload: {
    closeDialogId,
    tagId
  },
  type: TagsActionTypes.UPDATE_COMPLETE
})

// Update error
export const tagsUpdateError = ({error, tag}: {tag: Tag; error: any}): TagsUpdateErrorAction => ({
  payload: {
    error,
    tag
  },
  type: TagsActionTypes.UPDATE_ERROR
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
      const {assetId, name} = action.payload

      // Strip whitespace
      const sanitizedName = name.trim()

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        checkTagName(sanitizedName),
        mergeMap(() =>
          from(
            client.create({
              _type: TAG_DOCUMENT_NAME,
              name: {
                _type: 'slug',
                current: sanitizedName
              }
            })
          )
        ),
        mergeMap(result => of(tagsCreateComplete({assetId, tag: result as Tag}))),
        catchError((error: ClientError) =>
          of(
            tagsCreateError({
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
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Fetch assets which reference this tag
        mergeMap(() => {
          return from(
            client.fetch(
              `*[
                _type in ["sanity.fileAsset", "sanity.imageAsset"]
                && references(*[_type == "media.tag" && name.current == $tagName]._id)
              ] {
                _id,
                _rev,
                opt
              }`,
              {tagName: tag.name.current}
            )
          ) as Observable<Asset[]>
        }),
        // Create transaction which remove tag references from all matched assets and delete tag
        mergeMap((assets: Asset[]) => {
          const patches = assets.map(asset => ({
            id: asset._id,
            patch: {
              // this will cause the transaction to fail if the document has been modified since it was fetched.
              ifRevisionID: asset._rev,
              unset: [`opt.media.tags[_ref == "${tag._id}"]`]
            }
          }))

          const transaction: Transaction = patches.reduce(
            (transaction, patch) => transaction.patch(patch.id, patch.patch),
            client.transaction()
          )

          transaction.delete(tag._id)

          return from(transaction.commit())
        }),
        // Dispatch complete action
        mergeMap(() => of(tagsDeleteComplete(tag._id))),
        catchError((error: ClientError) =>
          of(
            tagsDeleteError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              tag
            })
          )
        )
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
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Fetch tags
        mergeMap(() => from(client.fetch(query, params))),
        // Dispatch complete action
        mergeMap((result: any) => {
          const {items} = result
          return of(tagsFetchComplete(items))
        }),
        catchError((error: ClientError) =>
          of(
            tagsFetchError({
              message: error?.message || 'Internal error',
              statusCode: error?.statusCode || 500
            })
          )
        )
      )
    })
  )

/**
 * Re-sort tags on updates
 */
export const tagsSortEpic = (action$: Observable<TagsActions>): Observable<TagsActions> =>
  action$.pipe(
    filter(
      isOfType([
        TagsActionTypes.LISTENER_UPDATE, //
        TagsActionTypes.LISTENER_CREATE
      ])
    ),
    switchMap(() => {
      return of(tagsSort())
    })
  )

/**
 * Listen for asset update requests:
 * - make async call to `client.patch`
 * - return a corresponding success or error action
 */
export const tagsUpdateEpic = (
  action$: Observable<TagsActions>,
  state$: StateObservable<RootReducerState>
): Observable<TagsActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.UPDATE_REQUEST)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {closeDialogId, formData, tag} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Check if tag name is available, throw early if not
        checkTagName(formData?.name?.current),
        // Patch document (Update tag)
        mergeMap(
          () =>
            from(
              client
                .patch(tag._id)
                .set({name: {_type: 'slug', current: formData?.name.current}})
                .commit()
            ) as Observable<Tag>
        ),
        // Dispatch complete action
        mergeMap((updatedTag: Tag) => {
          return of(
            tagsUpdateComplete({
              closeDialogId,
              tagId: updatedTag._id
            })
          )
        }),
        catchError((error: ClientError) =>
          of(
            tagsUpdateError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              tag
            })
          )
        )
      )
    })
  )

/*************
 * SELECTORS *
 *************/

const selectTagsByIds = (state: RootReducerState) => state.tags.byIds

export const selectTags: Selector<RootReducerState, TagItem[]> = createSelector(
  [selectTagsByIds, state => state.tags.allIds],
  (byIds, allIds) => allIds.map(id => byIds[id])
)

export const selectTagById = createSelector(
  [selectTagsByIds, (_state: RootReducerState, tagId: string) => tagId],
  (byIds, tagId) => byIds[tagId]
)

// Map tag references to react-select options, skipping over items with no linked tags
export const selectTagSelectOptions = (asset?: Asset) => (
  state: RootReducerState
): ReactSelectOption[] | null => {
  const tags = asset?.opt?.media?.tags?.reduce((acc: TagItem[], v) => {
    const tagItem = state.tags.byIds[v._ref]
    if (tagItem?.tag) {
      acc.push(tagItem)
    }
    return acc
  }, [])

  if (tags && tags?.length > 0) {
    return getTagSelectOptions(tags)
  }

  return null
}
