import {createSelector} from '@reduxjs/toolkit'
import {ClientError, Patch, Transaction} from '@sanity/client'
import {
  Asset,
  AssetItem,
  BrowserView,
  HttpError,
  OrderDirection,
  SearchFacetInputProps,
  Tag
} from '@types'
import groq from 'groq'
import produce from 'immer'
import {nanoid} from 'nanoid'
import client from 'part:@sanity/base/client'
import {Selector} from 'react-redux'
import {StateObservable} from 'redux-observable'
import {from, empty, of, Observable} from 'rxjs'
import {
  catchError,
  debounceTime,
  filter,
  mergeAll,
  mergeMap,
  switchMap,
  withLatestFrom
} from 'rxjs/operators'
import {isOfType} from 'typesafe-actions'

import {ORDER_OPTIONS, ORDER_DICTIONARY, SEARCH_FACET_OPERATORS} from '../../constants'
import debugThrottle from '../../operators/debugThrottle'
import {
  AssetsActions,
  AssetsTagsAddAction,
  AssetsTagsAddCompleteAction,
  AssetsTagsAddErrorAction,
  AssetsTagsRemoveAction,
  AssetsTagsRemoveCompleteAction,
  AssetsTagsRemoveErrorAction,
  AssetsClearAction,
  AssetsDeleteCompleteAction,
  AssetsDeleteErrorAction,
  AssetsDeletePickedAction,
  AssetsDeleteRequestAction,
  AssetsFetchCompleteAction,
  AssetsFetchErrorAction,
  AssetsFetchRequestAction,
  AssetsListenerDeleteAction,
  AssetsListenerUpdateAction,
  AssetsLoadNextPageAction,
  AssetsLoadPageIndexAction,
  AssetsPickAction,
  AssetsPickAllAction,
  AssetsPickClearAction,
  AssetsPickRangeAction,
  AssetsReducerState,
  AssetsSetOrderAction,
  AssetsSetViewAction,
  AssetsSortAction,
  AssetsUpdateCompleteAction,
  AssetsUpdateErrorAction,
  AssetsUpdateRequestAction
} from './types'
import {RootReducerState} from '../types'
import {SearchActionTypes} from '../search'
import {SearchActions} from '../search/types'

/***********
 * ACTIONS *
 ***********/

export enum AssetsActionTypes {
  CLEAR = 'ASSETS_CLEAR',
  DELETE_COMPLETE = 'ASSETS_DELETE_COMPLETE',
  DELETE_ERROR = 'ASSETS_DELETE_ERROR',
  DELETE_PICKED = 'ASSETS_DELETE_PICKED',
  DELETE_REQUEST = 'ASSETS_DELETE_REQUEST',
  FETCH_COMPLETE = 'ASSETS_FETCH_COMPLETE',
  FETCH_ERROR = 'ASSETS_FETCH_ERROR',
  FETCH_REQUEST = 'ASSETS_FETCH_REQUEST',
  LISTENER_DELETE = 'ASSETS_LISTENER_DELETE',
  LISTENER_UPDATE = 'ASSETS_LISTENER_UPDATE',
  LOAD_NEXT_PAGE = 'ASSETS_LOAD_NEXT_PAGE',
  LOAD_PAGE_INDEX = 'ASSETS_LOAD_PAGE_INDEX',
  PICK = 'ASSETS_PICK',
  PICK_ALL = 'ASSETS_PICK_ALL',
  PICK_CLEAR = 'ASSETS_PICK_CLEAR',
  PICK_RANGE = 'ASSETS_PICK_RANGE',
  SET_ORDER = 'ASSETS_SET_ORDER',
  SET_SEARCH_QUERY = 'ASSETS_SET_SEARCH_QUERY',
  SET_VIEW = 'ASSETS_SET_VIEW',
  SORT = 'ASSETS_SORT',
  TAGS_ADD_COMPLETE = 'ASSETS_TAGS_ADD_COMPLETE',
  TAGS_ADD_ERROR = 'ASSETS_TAGS_ADD_ERROR',
  TAGS_ADD_REQUEST = 'ASSETS_TAGS_ADD_REQUEST',
  TAGS_REMOVE_COMPLETE = 'ASSETS_TAGS_REMOVE_COMPLETE',
  TAGS_REMOVE_ERROR = 'ASSETS_TAGS_REMOVE_ERROR',
  TAGS_REMOVE_REQUEST = 'ASSETS_TAGS_REMOVE_REQUEST',
  UPDATE_COMPLETE = 'ASSETS_UPDATE_COMPLETE',
  UPDATE_ERROR = 'ASSETS_UPDATE_ERROR',
  UPDATE_REQUEST = 'ASSETS_UPDATE_REQUEST'
}

/***********
 * REDUCER *
 ***********/

/**
 * NOTE:
 * `fetchCount` returns the number of items retrieved in the most recent fetch.
 * This is a temporary workaround to be able to determine when there are no more items to retrieve.
 * Typically this would be done by deriving the total number of assets upfront, but currently such
 * queries in GROQ aren't fast enough to use on large datasets (1000s of entries).
 *
 * TODO:
 * When the query engine has been improved and above queries are faster, remove all instances of
 * of `fetchCount` and reinstate `totalCount` across the board.
 */

/**
 * `allIds` is an ordered array of all asset IDs
 * `byIds` is an object literal that contains all normalised assets (with asset IDs as keys)
 */

const defaultOrder = ORDER_OPTIONS[0] as {
  direction: OrderDirection
  field: string
}

export const initialState: AssetsReducerState = {
  allIds: [],
  byIds: {},
  fetchCount: -1,
  fetching: false,
  fetchingError: null,
  lastPicked: undefined,
  order: {
    direction: defaultOrder.direction,
    field: defaultOrder.field,
    title: ORDER_DICTIONARY[defaultOrder.field][defaultOrder.direction]
  },
  pageIndex: 0,
  pageSize: 50,
  view: 'grid'
  // totalCount: -1
}

export default function assetsReducerState(
  state: AssetsReducerState = initialState,
  action: AssetsActions | SearchActions
): AssetsReducerState {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      /**
       * Clear (not delete) all assets.
       * This is currently fired when changing browser filters / views, etc.
       * (May also be useful if we want more traditional paginated browsing, e.g going between pages
       * which doesn't persist content).
       */
      case AssetsActionTypes.CLEAR:
        draft.allIds = []
        break

      /**
       * An asset has been successfully deleted via the client.
       * - Delete asset from the redux store (both the normalised object and ordered asset ID).
       */
      case AssetsActionTypes.DELETE_COMPLETE: {
        const assetId = action.payload?.assetId
        const deleteIndex = draft.allIds.indexOf(assetId)

        if (deleteIndex >= 0) {
          draft.allIds.splice(deleteIndex, 1)
        }
        delete draft.byIds[assetId]
        // draft.totalCount -= 1
        break
      }
      /**
       * An asset was unable to be deleted via the client.
       * - Store the error code on asset in question to optionally display to the user.
       * - Clear updating status on asset in question.
       */
      case AssetsActionTypes.DELETE_ERROR: {
        const {asset, error} = action.payload
        const assetId = asset?._id
        draft.byIds[assetId].error = error
        draft.byIds[assetId].updating = false
        break
      }

      /**
       * A request to delete an asset has been made (and not yet completed).
       * - Set updating and clear picked status on target asset.
       * - Clear any existing asset errors.
       */
      case AssetsActionTypes.DELETE_REQUEST: {
        const assetId = action.payload?.asset?._id
        draft.byIds[assetId].picked = false
        draft.byIds[assetId].updating = true

        Object.keys(draft.byIds).forEach(key => {
          delete draft.byIds[key].error
        })

        break
      }

      /**
       * A request to fetch assets has succeeded.
       * - Add all fetched assets as normalised objects, and store asset IDs in a separate ordered array.
       */
      case AssetsActionTypes.FETCH_COMPLETE: {
        const assets = action.payload?.assets || []
        // const totalCount = action.payload?.totalCount

        if (assets) {
          assets.forEach(asset => {
            draft.allIds.push(asset._id)
            draft.byIds[asset._id] = {
              asset: asset,
              picked: false,
              updating: false
            }
          })
        }

        draft.fetching = false
        draft.fetchCount = assets.length || 0
        draft.fetchingError = null
        // draft.totalCount = totalCount
        break
      }

      /**
       * A request to fetch assets has failed.
       * - Clear fetching status
       * - Store error status
       */
      case AssetsActionTypes.FETCH_ERROR: {
        draft.fetching = false
        draft.fetchingError = true
        break
      }

      /**
       * A request to fetch asset has been made (and not yet completed)
       * - Set fetching status
       * - Clear any previously stored error
       */
      case AssetsActionTypes.FETCH_REQUEST:
        draft.fetching = true
        draft.fetchingError = null
        break

      /**
       * An asset has been successfully deleted via the client.
       * - Delete asset from the redux store (both the normalised object and ordered asset ID).
       */
      case AssetsActionTypes.LISTENER_DELETE: {
        const assetId = action.payload?.assetId
        const deleteIndex = draft.allIds.indexOf(assetId)
        if (deleteIndex >= 0) {
          draft.allIds.splice(deleteIndex, 1)
        }
        delete draft.byIds[assetId]
        break
      }
      /**
       * An asset has been successfully updated via the client.
       * - Update asset in `byIds`
       */
      case AssetsActionTypes.LISTENER_UPDATE: {
        const asset = action.payload?.asset
        if (draft.byIds[asset._id]) {
          draft.byIds[asset._id].asset = asset
        }
        break
      }

      case AssetsActionTypes.LOAD_NEXT_PAGE:
        draft.pageIndex += 1
        break

      /**
       * An asset as 'picked' or 'checked' for batch operations.
       * (We don't use the word 'select' as that's reserved for the action of inserting an image into an entry).
       * - Set picked status for asset in question
       */
      case AssetsActionTypes.PICK: {
        const assetId = action.payload?.assetId
        const picked = action.payload?.picked

        draft.byIds[assetId].picked = picked
        draft.lastPicked = picked ? assetId : undefined
        break
      }
      /**
       * All (visible) assets have been picked.
       */
      case AssetsActionTypes.PICK_ALL:
        draft.allIds.forEach(id => {
          draft.byIds[id].picked = true
        })
        break

      /**
       * All (visible) assets have been unpicked.
       */
      case AssetsActionTypes.PICK_CLEAR:
        draft.lastPicked = undefined
        Object.values(draft.byIds).forEach(asset => {
          draft.byIds[asset.asset._id].picked = false
        })
        break

      /**
       * A range of assets have been picked.
       */
      case AssetsActionTypes.PICK_RANGE: {
        const startIndex = draft.allIds.findIndex(id => id === action.payload.startId)
        const endIndex = draft.allIds.findIndex(id => id === action.payload.endId)

        // Sort numerically, ascending order
        const indices = [startIndex, endIndex].sort((a, b) => a - b)

        draft.allIds.slice(indices[0], indices[1] + 1).forEach(key => {
          draft.byIds[key].picked = true
        })
        draft.lastPicked = draft.allIds[endIndex]

        break
      }

      case AssetsActionTypes.SET_ORDER:
        draft.order = action.payload?.order
        draft.pageIndex = 0
        break

      case AssetsActionTypes.SET_VIEW:
        draft.view = action.payload?.view
        break

      case AssetsActionTypes.SORT:
        draft.allIds.sort((a, b) => {
          const tagA = draft.byIds[a].asset[draft.order.field]
          const tagB = draft.byIds[b].asset[draft.order.field]

          if (tagA < tagB) {
            return draft.order.direction === 'asc' ? -1 : 1
          } else if (tagA > tagB) {
            return draft.order.direction === 'asc' ? 1 : -1
          } else {
            return 0
          }
        })
        break

      case AssetsActionTypes.TAGS_ADD_COMPLETE:
      case AssetsActionTypes.TAGS_REMOVE_COMPLETE: {
        // Mark assets as no longer updating
        const {assets} = action.payload

        assets.forEach(asset => {
          draft.byIds[asset.asset._id].updating = false
        })
        break
      }

      case AssetsActionTypes.TAGS_ADD_ERROR:
      case AssetsActionTypes.TAGS_REMOVE_ERROR: {
        // Mark assets as no longer updating
        const {assets} = action.payload

        assets.forEach(asset => {
          draft.byIds[asset.asset._id].updating = false
        })
        break
      }

      case AssetsActionTypes.TAGS_ADD_REQUEST:
      case AssetsActionTypes.TAGS_REMOVE_REQUEST: {
        // Mark assets as updating
        const {assets} = action.payload

        assets.forEach(asset => {
          draft.byIds[asset.asset._id].updating = true
        })
        break
      }

      /**
       * An asset has been successfully updated via the client.
       * - Update asset in `byIds`
       */
      case AssetsActionTypes.UPDATE_COMPLETE: {
        const assetId = action.payload?.assetId
        draft.byIds[assetId].updating = false
        break
      }

      /**
       * An asset was unable to be updated via the client.
       * - Store the error code on asset in question to optionally display to the user.
       * - Clear updating status on asset in question.
       */
      case AssetsActionTypes.UPDATE_ERROR: {
        const {asset, error} = action.payload

        const assetId = asset?._id
        draft.byIds[assetId].error = error
        draft.byIds[assetId].updating = false
        break
      }

      /**
       * A request to update an asset has been made (and not yet completed).
       * - Set updating status on target asset.
       * - Clear any existing asset errors.
       */
      case AssetsActionTypes.UPDATE_REQUEST: {
        const assetId = action.payload?.asset?._id
        draft.byIds[assetId].updating = true
        break
      }

      // TODO: should this be moved into an epic + extra action?
      case SearchActionTypes.SEARCH_QUERY_SET:
        draft.pageIndex = 0
        break
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// Clear all assets
export const assetsClear = (): AssetsClearAction => ({
  type: AssetsActionTypes.CLEAR
})

// Delete started
export const assetsDelete = ({
  asset,
  closeDialogId
}: {
  asset: Asset
  closeDialogId?: string
}): AssetsDeleteRequestAction => ({
  payload: {
    asset,
    closeDialogId
  },
  type: AssetsActionTypes.DELETE_REQUEST
})

// Delete success
export const assetsDeleteComplete = ({
  assetId,
  closeDialogId
}: {
  assetId: string
  closeDialogId?: string
}): AssetsDeleteCompleteAction => ({
  payload: {
    assetId,
    closeDialogId
  },
  type: AssetsActionTypes.DELETE_COMPLETE
})

// Delete error
export const assetsDeleteError = ({
  asset,
  error
}: {
  asset: Asset
  error: HttpError
}): AssetsDeleteErrorAction => {
  console.log('error', error)
  return {
    payload: {
      asset,
      error
    },
    type: AssetsActionTypes.DELETE_ERROR
  }
}

// Delete all picked assets
export const assetsDeletePicked = (): AssetsDeletePickedAction => ({
  type: AssetsActionTypes.DELETE_PICKED
})

/**
 * Start fetch with constructed GROQ query
 *
 * @param {Object} [options]
 * @param {String} [options.filter] - GROQ filter
 * @param {Object} [options.params] - Params to pass to GROQ query (in `client.fetch`)
 * @param {String} [options.projections] - GROQ projections (must be wrapped in braces)
 * @param {String} [options.selector] - GROQ selector / range
 * @param {String} [options.sort] - GROQ sort
 */
export const assetsFetch = ({
  filter,
  params = {},
  selector = ``,
  sort = groq`order(_updatedAt desc)`
}: {
  filter: string
  params?: Record<string, string>
  replace?: boolean
  selector?: string
  sort?: string
}): AssetsFetchRequestAction => {
  const pipe = sort || selector ? '|' : ''

  // Construct query
  const query = groq`
    {
      "items": *[${filter}] {
        _id,
        _type,
        _updatedAt,
        altText,
        description,
        extension,
        metadata {
          dimensions,
          exif,
          isOpaque,
        },
        mimeType,
        opt {
          media
        },
        originalFilename,
        size,
        title,
        url
      } ${pipe} ${sort} ${selector},
    }
  `

  return {
    payload: {params, query},
    type: AssetsActionTypes.FETCH_REQUEST
  }
}

// Fetch complete
export const assetsFetchComplete = (
  assets: Asset[]
  // totalCount: number
): AssetsFetchCompleteAction => ({
  payload: {
    assets
    // totalCount
  },
  type: AssetsActionTypes.FETCH_COMPLETE
})

// Fetch failed
export const assetsFetchError = (error: HttpError): AssetsFetchErrorAction => ({
  payload: {error},
  type: AssetsActionTypes.FETCH_ERROR
})

// Asset deleted via listener
export const assetsListenerDelete = (assetId: string): AssetsListenerDeleteAction => ({
  payload: {assetId},
  type: AssetsActionTypes.LISTENER_DELETE
})

// Asset updated via listener
export const assetsListenerUpdate = (asset: Asset): AssetsListenerUpdateAction => ({
  payload: {asset},
  type: AssetsActionTypes.LISTENER_UPDATE
})

// Load page assets at page index
export const assetsLoadPageIndex = (pageIndex: number): AssetsLoadPageIndexAction => ({
  payload: {pageIndex},
  type: AssetsActionTypes.LOAD_PAGE_INDEX
})

// Load next page
export const assetsLoadNextPage = (): AssetsLoadNextPageAction => ({
  type: AssetsActionTypes.LOAD_NEXT_PAGE
})

// Pick asset
export const assetsPick = (assetId: string, picked: boolean): AssetsPickAction => ({
  payload: {assetId, picked},
  type: AssetsActionTypes.PICK
})

// Pick all assets
export const assetsPickAll = (): AssetsPickAllAction => ({
  type: AssetsActionTypes.PICK_ALL
})

// Unpick all assets
export const assetsPickClear = (): AssetsPickClearAction => ({
  type: AssetsActionTypes.PICK_CLEAR
})

// Pick a range of assets
export const assetsPickRange = (startId: string, endId: string): AssetsPickRangeAction => ({
  payload: {endId, startId},
  type: AssetsActionTypes.PICK_RANGE
})

// Set view mode
export const assetsSetView = (view: BrowserView): AssetsSetViewAction => ({
  payload: {view},
  type: AssetsActionTypes.SET_VIEW
})

// Set order
export const assetsSetOrder = (field: string, direction: OrderDirection): AssetsSetOrderAction => ({
  payload: {order: {direction, field, title: ORDER_DICTIONARY[field][direction]}},
  type: AssetsActionTypes.SET_ORDER
})

// Sort assets by current field + direction
export const assetsSort = (): AssetsSortAction => ({
  type: AssetsActionTypes.SORT
})

export const assetsTagsAdd = ({
  assets,
  tag
}: {
  assets: AssetItem[]
  tag: Tag
}): AssetsTagsAddAction => ({
  payload: {assets, tag},
  type: AssetsActionTypes.TAGS_ADD_REQUEST
})

export const assetsTagsAddComplete = ({
  assets,
  tag
}: {
  assets: AssetItem[]
  tag: Tag
}): AssetsTagsAddCompleteAction => ({
  payload: {assets, tag},
  type: AssetsActionTypes.TAGS_ADD_COMPLETE
})

export const assetsTagsAddError = ({
  assets,
  error,
  tag
}: {
  assets: AssetItem[]
  error: HttpError
  tag: Tag
}): AssetsTagsAddErrorAction => ({
  payload: {assets, error, tag},
  type: AssetsActionTypes.TAGS_ADD_ERROR
})

export const assetsTagsRemove = ({
  assets,
  tag
}: {
  assets: AssetItem[]
  tag: Tag
}): AssetsTagsRemoveAction => ({
  payload: {assets, tag},
  type: AssetsActionTypes.TAGS_REMOVE_REQUEST
})

export const assetsTagsRemoveComplete = ({
  assets,
  tag
}: {
  assets: AssetItem[]
  tag: Tag
}): AssetsTagsRemoveCompleteAction => ({
  payload: {assets, tag},
  type: AssetsActionTypes.TAGS_REMOVE_COMPLETE
})

export const assetsTagsRemoveError = ({
  assets,
  error,
  tag
}: {
  assets: AssetItem[]
  error: HttpError
  tag: Tag
}): AssetsTagsRemoveErrorAction => ({
  payload: {assets, error, tag},
  type: AssetsActionTypes.TAGS_REMOVE_ERROR
})

// Update started
export const assetsUpdate = ({
  asset,
  closeDialogId,
  formData
}: {
  asset: Asset
  closeDialogId?: string
  formData: Record<string, any>
}): AssetsUpdateRequestAction => ({
  payload: {asset, closeDialogId, formData},
  type: AssetsActionTypes.UPDATE_REQUEST
})

// Delete success
export const assetsUpdateComplete = ({
  assetId,
  closeDialogId
}: {
  assetId: string
  closeDialogId?: string
}): AssetsUpdateCompleteAction => ({
  payload: {assetId, closeDialogId},
  type: AssetsActionTypes.UPDATE_COMPLETE
})

// Update error
export const assetsUpdateError = ({
  asset,
  error
}: {
  asset: Asset
  error: HttpError
}): AssetsUpdateErrorAction => ({
  payload: {asset, error},
  type: AssetsActionTypes.UPDATE_ERROR
})

/*********
 * EPICS *
 *********/

/**
 * Listen for asset delete requests:
 * - make async call to `client.delete`
 * - return a corresponding success or error action
 */
export const assetsDeleteEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> => {
  return action$.pipe(
    filter(isOfType(AssetsActionTypes.DELETE_REQUEST)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {asset} = action.payload
      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => from(client.delete(asset._id))),
        mergeMap(() => of(assetsDeleteComplete({assetId: asset._id}))),
        catchError((error: ClientError) =>
          of(
            assetsDeleteError({
              asset,
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

/**
 * Listen for requests to delete all picked assets:
 * - get all picked items not already in the process of updating
 * - invoke delete action creator for all INDIVIDUAL assets
 */
export const assetsDeletePickedEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.DELETE_PICKED)),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const availableItems = Object.entries(state.assets.byIds).filter(([, value]) => {
        return value.picked && !value.updating
      })

      if (availableItems.length === 0) {
        return empty()
      }

      const assets = availableItems.map((item: any) => item[1].asset)
      return of(assets)
    }),
    mergeAll(),
    mergeMap((asset: any) => of(assetsDelete({asset})))
  )

/**
 * Listen for fetch requests:
 * - make async call to `client.fetch`
 * - return a corresponding success or error action
 */
export const assetsFetchEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.FETCH_REQUEST)),
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

          return of(assetsFetchComplete(items))
        }),
        catchError((error: ClientError) =>
          of(
            assetsFetchError({
              message: error?.message || 'Internal error',
              statusCode: error?.statusCode || 500
            })
          )
        )
      )
    })
  )

/**
 * Listen for page load requests
 * - Fetch assets
 */
export const assetsFetchPageIndexEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.LOAD_PAGE_INDEX)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const pageSize = state.assets.pageSize
      const start = action.payload.pageIndex * pageSize
      const end = start + pageSize

      const documentId = state?.document?._id

      return of(
        assetsFetch({
          filter: constructFilter({
            hasDocument: !!state.document,
            searchFacets: state.search.facets,
            searchQuery: state.search.query
          }),
          // Document ID can be null when operating on pristine / unsaved drafts
          ...(documentId ? {params: {documentId}} : {}),
          selector: groq`[${start}...${end}]`,
          sort: groq`order(${state.assets?.order?.field} ${state.assets?.order?.direction})`
        })
      )
    })
  )

/**
 * Listen for changes to order, filter and search query
 * - Clear assets
 * - Load first page
 */
export const assetsFetchNextPageEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.LOAD_NEXT_PAGE)),
    withLatestFrom(state$),
    switchMap(([_, state]) => {
      return of(assetsLoadPageIndex(state.assets.pageIndex))
    })
  )

// Remove tags from all picked assets
export const assetsRemoveTagsEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> => {
  return action$.pipe(
    filter(isOfType(AssetsActionTypes.TAGS_ADD_REQUEST)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {assets, tag} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Add tag references to all picked assets
        mergeMap(() => {
          const pickedAssets = selectAssetsPicked(state)

          // Filter out picked assets which already include tag
          const pickedAssetsFiltered = pickedAssets?.filter(assetItem => {
            const tagIndex =
              assetItem?.asset?.opt?.media?.tags?.findIndex(t => t._ref === tag?._id) ?? -1
            return tagIndex < 0
          })

          const transaction: Transaction = pickedAssetsFiltered.reduce(
            (transaction, pickedAsset) => {
              return transaction.patch(pickedAsset?.asset?._id, (patch: Patch) =>
                patch
                  .setIfMissing({opt: {}})
                  .setIfMissing({'opt.media': {}})
                  .setIfMissing({'opt.media.tags': []})
                  .append('opt.media.tags', [
                    {_key: nanoid(), _ref: tag?._id, _type: 'reference', _weak: true}
                  ])
              )
            },
            client.transaction()
          )

          return from(transaction.commit())
        }),
        // Dispatch complete action
        mergeMap(() => of(assetsTagsAddComplete({assets, tag}))),
        catchError((error: ClientError) =>
          of(
            assetsTagsAddError({
              assets,
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
 * Listen for search query + facet changes (debounced)
 * - clear assets
 * - fetch first page
 */

export const assetsSearchEpic = (action$: Observable<AssetsActions>): Observable<AssetsActions> =>
  action$.pipe(
    filter(
      isOfType([
        SearchActionTypes.SEARCH_FACETS_TAG_ADD_OR_UPDATE,
        SearchActionTypes.SEARCH_FACETS_ADD,
        SearchActionTypes.SEARCH_FACETS_CLEAR,
        SearchActionTypes.SEARCH_FACETS_REMOVE,
        SearchActionTypes.SEARCH_FACETS_UPDATE,
        SearchActionTypes.SEARCH_QUERY_SET
      ])
    ),
    debounceTime(400),
    switchMap(() => {
      return of(assetsClear(), assetsLoadPageIndex(0))
    })
  )

/**
 * Listen for order changes
 * - clear assets
 * - fetch first page
 */
export const assetsSetOrderEpic = (action$: Observable<AssetsActions>): Observable<AssetsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.SET_ORDER)),
    switchMap(() => {
      return of(assetsClear(), assetsLoadPageIndex(0))
    })
  )

/**
 * Re-sort assets on updates
 */

export const assetsSortEpic = (action$: Observable<AssetsActions>): Observable<AssetsActions> =>
  action$.pipe(
    filter(
      isOfType([
        AssetsActionTypes.LISTENER_UPDATE, //
        AssetsActionTypes.UPDATE_COMPLETE
      ])
    ),
    switchMap(() => {
      return of(assetsSort())
    })
  )

// Add tags to all picked assets
export const assetsTagsAddEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> => {
  return action$.pipe(
    filter(isOfType(AssetsActionTypes.TAGS_ADD_REQUEST)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {assets, tag} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Add tag references to all picked assets
        mergeMap(() => {
          const pickedAssets = selectAssetsPicked(state)

          // Filter out picked assets which already include tag
          const pickedAssetsFiltered = pickedAssets?.filter(assetItem => {
            const tagIndex =
              assetItem?.asset?.opt?.media?.tags?.findIndex(t => t._ref === tag?._id) ?? -1
            return tagIndex < 0
          })

          const transaction: Transaction = pickedAssetsFiltered.reduce(
            (transaction, pickedAsset) => {
              return transaction.patch(pickedAsset?.asset?._id, (patch: Patch) =>
                patch
                  .ifRevisionId(pickedAsset?.asset?._rev)
                  .setIfMissing({opt: {}})
                  .setIfMissing({'opt.media': {}})
                  .setIfMissing({'opt.media.tags': []})
                  .append('opt.media.tags', [
                    {_key: nanoid(), _ref: tag?._id, _type: 'reference', _weak: true}
                  ])
              )
            },
            client.transaction()
          )

          return from(transaction.commit())
        }),
        // Dispatch complete action
        mergeMap(() => of(assetsTagsAddComplete({assets, tag}))),
        catchError((error: ClientError) =>
          of(
            assetsTagsAddError({
              assets,
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

// Remove tags from all picked assets
export const assetsTagsRemoveEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> => {
  return action$.pipe(
    filter(isOfType(AssetsActionTypes.TAGS_REMOVE_REQUEST)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {assets, tag} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Remove tag references from all picked assets
        mergeMap(() => {
          const pickedAssets = selectAssetsPicked(state)

          const transaction: Transaction = pickedAssets.reduce((transaction, pickedAsset) => {
            return transaction.patch(pickedAsset?.asset?._id, (patch: Patch) =>
              patch
                .ifRevisionId(pickedAsset?.asset?._rev)
                .unset([`opt.media.tags[_ref == "${tag._id}"]`])
            )
          }, client.transaction())

          return from(transaction.commit())
        }),
        // Dispatch complete action
        mergeMap(() => of(assetsTagsRemoveComplete({assets, tag}))),
        catchError((error: ClientError) =>
          of(
            assetsTagsRemoveError({
              assets,
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
 * Unpick all assets on search / view changes
 */

export const assetsUnpickEpic = (action$: Observable<AssetsActions>): Observable<AssetsActions> =>
  action$.pipe(
    filter(
      isOfType([
        AssetsActionTypes.SET_ORDER,
        AssetsActionTypes.SET_VIEW,
        SearchActionTypes.SEARCH_FACETS_TAG_ADD_OR_UPDATE,
        SearchActionTypes.SEARCH_FACETS_ADD,
        SearchActionTypes.SEARCH_FACETS_CLEAR,
        SearchActionTypes.SEARCH_FACETS_REMOVE,
        SearchActionTypes.SEARCH_FACETS_UPDATE,
        SearchActionTypes.SEARCH_QUERY_SET
      ])
    ),
    switchMap(() => {
      return of(assetsPickClear())
    })
  )

/**
 * Listen for asset update requests:
 * - make async call to `client.patch`
 * - return a corresponding success or error action
 */
export const assetsUpdateEpic = (
  action$: Observable<AssetsActions>,
  state$: StateObservable<RootReducerState>
): Observable<AssetsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.UPDATE_REQUEST)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {asset, closeDialogId, formData} = action.payload

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          from(
            client
              .patch(asset._id)
              .setIfMissing({opt: {}})
              .setIfMissing({'opt.media': {}})
              .set(formData)
              .commit()
          )
        ),
        mergeMap((updatedAsset: any) =>
          of(
            assetsUpdateComplete({
              assetId: updatedAsset._id,
              closeDialogId
            })
          )
        ),
        catchError((error: ClientError) =>
          of(
            assetsUpdateError({
              asset,
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

/*********
 * UTILS *
 *********/

/**
 * Construct GROQ filter based off search facets and query
 */

const constructFilter = ({
  hasDocument,
  searchFacets,
  searchQuery
}: {
  hasDocument?: boolean
  searchFacets: SearchFacetInputProps[]
  searchQuery?: string
}) => {
  // Fetch both images and files if being used as a tool
  // Otherwise, only fetch images. Sanity will crash you try and insert a file into an image field!
  const baseFilter = hasDocument
    ? groq`_type == "sanity.imageAsset" && !(_id in path("drafts.**"))`
    : groq`_type in ["sanity.fileAsset", "sanity.imageAsset"] && !(_id in path("drafts.**"))`

  const searchFacetFragments = searchFacets.reduce((acc: string[], facet) => {
    if (facet.type === 'number') {
      const {field, modifier, modifiers, operatorType, value} = facet
      const operator = SEARCH_FACET_OPERATORS[operatorType]

      // Get current modifier
      const currentModifier = modifiers?.find(m => m.name === modifier)

      // Apply field modifier function (if present)
      const facetField = currentModifier?.fieldModifier
        ? currentModifier.fieldModifier(field)
        : field

      const fragment = operator.fn(value, facetField)
      if (fragment) {
        acc.push(fragment)
      }
    }

    if (facet.type === 'searchable') {
      const {field, operatorType, value} = facet
      const operator = SEARCH_FACET_OPERATORS[operatorType]

      const fragment = operator.fn(value?.value, field)
      if (fragment) {
        acc.push(fragment)
      }
    }

    if (facet.type === 'select') {
      const {field, operatorType, options, value} = facet
      const operator = SEARCH_FACET_OPERATORS[operatorType]

      const currentOptionValue = options?.find(l => l.name === value)?.value

      const fragment = operator.fn(currentOptionValue, field)
      if (fragment) {
        acc.push(fragment)
      }
    }

    if (facet.type === 'string') {
      const {field, operatorType, value} = facet
      const operator = SEARCH_FACET_OPERATORS[operatorType]

      const fragment = operator.fn(value, field)
      if (fragment) {
        acc.push(fragment)
      }
    }

    return acc
  }, [])

  // Join separate filter fragments
  const constructedQuery = [
    // Base filter
    baseFilter,
    // Search query (if present)
    // NOTE: Currently this only searches direct fields on sanity.fileAsset/sanity.imageAsset and NOT referenced tags
    // It's possible to add this by adding the following line to the searchQuery, but it's quite slow
    // references(*[_type == "media.tag" && name.current == "${searchQuery.trim()}"]._id)
    ...(searchQuery
      ? [groq`[altText, description, originalFilename, title] match '*${searchQuery.trim()}*'`]
      : []),
    // Search facets
    ...searchFacetFragments
  ].join(' && ')

  return constructedQuery
}

/*************
 * SELECTORS *
 *************/

const selectAssetsByIds = (state: RootReducerState) => state.assets.byIds

const selectAssetsAllIds = (state: RootReducerState) => state.assets.allIds

export const selectAssetById = createSelector(
  [
    (state: RootReducerState) => state.assets.byIds,
    (_state: RootReducerState, assetId: string) => assetId
  ],
  (byIds, assetId) => byIds[assetId]
)

export const selectAssets: Selector<RootReducerState, AssetItem[]> = createSelector(
  [selectAssetsByIds, selectAssetsAllIds],
  (byIds, allIds) => allIds.map(id => byIds[id])
)

export const selectAssetsLength = createSelector([selectAssets], assets => assets.length)

export const selectAssetsPicked = createSelector([selectAssets], assets =>
  assets.filter(item => item?.picked)
)

export const selectAssetsPickedLength = createSelector(
  [selectAssetsPicked],
  assetsPicked => assetsPicked.length
)
