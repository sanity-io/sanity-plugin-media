import {Asset, BrowserView, Order, SearchFacetInputProps} from '@types'
import groq from 'groq'
import produce from 'immer'
import client from 'part:@sanity/base/client'
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

import {BROWSER_SELECT, SEARCH_FACET_OPERATORS} from '../../constants'
import debugThrottle from '../../operators/debugThrottle'
import {
  AssetsActions,
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
  AssetsSearchFacetsAddAction,
  AssetsSearchFacetsClearAction,
  AssetsSearchFacetsRemoveAction,
  AssetsSearchFacetsUpdateAction,
  AssetsSetOrderAction,
  AssetsSetSearchQueryAction,
  AssetsSetViewAction,
  AssetsSortAction,
  AssetsUpdateCompleteAction,
  AssetsUpdateErrorAction,
  AssetsUpdateRequestAction
} from './types'
import {RootReducerState} from '../types'

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
  SEARCH_FACETS_ADD = 'ASSETS_SEARCH_FACET_ADD',
  SEARCH_FACETS_CLEAR = 'ASSETS_SEARCH_FACET_CLEAR',
  SEARCH_FACETS_REMOVE = 'ASSETS_SEARCH_FACET_REMOVE',
  SEARCH_FACETS_UPDATE = 'ASSETS_SEARCH_FACET_UPDATE',
  SET_ORDER = 'ASSETS_SET_ORDER',
  SET_SEARCH_QUERY = 'ASSETS_SET_SEARCH_QUERY',
  SET_VIEW = 'ASSETS_SET_VIEW',
  SORT = 'ASSETS_SORT',
  UNCAUGHT_EXCEPTION = 'ASSETS_UNCAUGHT_EXCEPTION',
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

export const initialState: AssetsReducerState = {
  allIds: [],
  byIds: {},
  fetchCount: -1,
  fetching: false,
  fetchingError: null,
  lastPicked: undefined,
  lastTouched: undefined,
  order: BROWSER_SELECT[0]?.order as Order,
  pageIndex: 0,
  pageSize: 50,
  searchFacets: [],
  searchQuery: '',
  view: 'grid'
  // totalCount: -1
}

export default function assetsReducerState(
  state: AssetsReducerState = initialState,
  action: AssetsActions
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
        const assetId = action.payload?.asset?._id
        const errorCode = action.payload?.error?.statusCode
        draft.byIds[assetId].errorCode = errorCode
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
          delete draft.byIds[key].errorCode
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
        draft.lastTouched = new Date().getTime()
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

        draft.lastTouched = new Date().getTime()
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
        draft.allIds.forEach(id => {
          draft.byIds[id].picked = false
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

      /**
       * A search facet has been added
       */
      case AssetsActionTypes.SEARCH_FACETS_ADD:
        draft.searchFacets.push(action.payload.facet)
        break
      /**
       * All search facet have been clear
       */
      case AssetsActionTypes.SEARCH_FACETS_CLEAR:
        draft.searchFacets = []
        break
      /**
       * A single search facet has been removed
       */
      case AssetsActionTypes.SEARCH_FACETS_REMOVE:
        draft.searchFacets = draft.searchFacets.filter(
          facet => facet.name !== action.payload.facetName
        )
        break
      /**
       * A single search facet has been updated
       */
      case AssetsActionTypes.SEARCH_FACETS_UPDATE:
        draft.searchFacets.forEach((facet, index) => {
          if (facet.name === action.payload.facet.name) {
            draft.searchFacets[index] = action.payload.facet
          }
        })
        break

      case AssetsActionTypes.SET_ORDER:
        draft.order = action.payload?.order
        draft.pageIndex = 0
        break
      case AssetsActionTypes.SET_SEARCH_QUERY:
        draft.searchQuery = action.payload?.searchQuery
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
        const assetId = action.payload?.asset?._id
        const errorCode = action.payload?.error?.statusCode
        draft.byIds[assetId].errorCode = errorCode
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
export const assetsDelete = (
  asset: Asset,
  options?: {
    closeDialogId?: string
  }
): AssetsDeleteRequestAction => ({
  payload: {
    asset,
    options
  },
  type: AssetsActionTypes.DELETE_REQUEST
})

// Delete success
export const assetsDeleteComplete = (
  assetId: string,
  options?: {closeDialogId?: string}
): AssetsDeleteCompleteAction => ({
  payload: {
    assetId,
    options
  },
  type: AssetsActionTypes.DELETE_COMPLETE
})

// Delete error
export const assetsDeleteError = (asset: Asset, error: any): AssetsDeleteErrorAction => ({
  payload: {
    asset,
    error
  },
  type: AssetsActionTypes.DELETE_ERROR
})

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
  filter = groq`_type == "sanity.imageAsset" && !(_id in path("drafts.**"))`,
  params = {},
  projections = groq`{
    _id,
    metadata {dimensions},
    originalFilename,
    url
  }`,
  selector = ``,
  sort = groq`order(_updatedAt desc)`
}: {
  filter?: string
  params?: Record<string, string>
  projections?: string
  replace?: boolean
  selector?: string
  sort?: string
}): AssetsFetchRequestAction => {
  const pipe = sort || selector ? '|' : ''

  // Construct query
  const query = groq`
    {
      "items": *[${filter}] ${projections} ${pipe} ${sort} ${selector},
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
export const assetsFetchError = (error: any): AssetsFetchErrorAction => ({
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

// Add search facet
export const assetsSearchFacetsAdd = (
  facet: SearchFacetInputProps
): AssetsSearchFacetsAddAction => ({
  payload: {facet},
  type: AssetsActionTypes.SEARCH_FACETS_ADD
})

// Clear search facets
export const assetsSearchFacetsClear = (): AssetsSearchFacetsClearAction => ({
  type: AssetsActionTypes.SEARCH_FACETS_CLEAR
})

// Remove search facet
export const assetsSearchFacetsRemove = (facetName: string): AssetsSearchFacetsRemoveAction => ({
  payload: {facetName},
  type: AssetsActionTypes.SEARCH_FACETS_REMOVE
})

// Update search facet
export const assetsSearchFacetsUpdate = (
  facet: SearchFacetInputProps
): AssetsSearchFacetsUpdateAction => ({
  payload: {facet},
  type: AssetsActionTypes.SEARCH_FACETS_UPDATE
})

// Set view mode
export const assetsSetView = (view: BrowserView): AssetsSetViewAction => ({
  payload: {view},
  type: AssetsActionTypes.SET_VIEW
})

// Set order
export const assetsSetOrder = (order: Order): AssetsSetOrderAction => ({
  payload: {order},
  type: AssetsActionTypes.SET_ORDER
})

// Set search query
export const assetsSetSearchQuery = (searchQuery: string): AssetsSetSearchQueryAction => ({
  payload: {searchQuery},
  type: AssetsActionTypes.SET_SEARCH_QUERY
})

// Sort assets by current field + direction
export const assetsSort = (): AssetsSortAction => ({
  type: AssetsActionTypes.SORT
})

// Update started
export const assetsUpdate = (
  asset: Asset,
  formData: Record<string, any>,
  options?: {closeDialogId?: string}
): AssetsUpdateRequestAction => ({
  payload: {
    asset,
    formData,
    options
  },
  type: AssetsActionTypes.UPDATE_REQUEST
})

// Delete success
export const assetsUpdateComplete = (
  assetId: string,
  options?: {closeDialogId?: string}
): AssetsUpdateCompleteAction => ({
  payload: {
    assetId,
    options
  },
  type: AssetsActionTypes.UPDATE_COMPLETE
})

// Delete error
export const assetsUpdateError = (asset: Asset, error: any): AssetsUpdateErrorAction => ({
  payload: {
    asset,
    error
  },
  type: AssetsActionTypes.UPDATE_ERROR
})

/*********
 * EPICS *
 *********/

/**
 * List for asset delete requests:
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
        mergeMap(() => of(assetsDeleteComplete(asset._id))),
        catchError(error => of(assetsDeleteError(asset, error)))
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
    mergeMap((asset: any) => of(assetsDelete(asset)))
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
        catchError(error => of(assetsFetchError(error)))
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

      return of(
        assetsFetch({
          filter: constructFilter(state.assets.searchFacets, state.assets.searchQuery),
          // Document ID can be null when operating on pristine / unsaved drafts
          ...(state?.document ? {params: {documentId: state?.document?._id}} : {}),
          projections: groq`{
            _id,
            _updatedAt,
            altText,
            description,
            extension,
            metadata {
              dimensions,
              isOpaque,
            },
            mimeType,
            originalFilename,
            size,
            tags,
            title,
            url
          }`,
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

/**
 * Listen for search query + facet changes (debounced)
 * - clear assets
 * - fetch first page
 */

export const assetsSearchEpic = (action$: Observable<AssetsActions>): Observable<AssetsActions> =>
  action$.pipe(
    filter(
      isOfType([
        AssetsActionTypes.SEARCH_FACETS_ADD,
        AssetsActionTypes.SEARCH_FACETS_CLEAR,
        AssetsActionTypes.SEARCH_FACETS_REMOVE,
        AssetsActionTypes.SEARCH_FACETS_UPDATE,
        AssetsActionTypes.SET_SEARCH_QUERY
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

/**
 * Unpick all assets on search / view changes
 */

export const assetsUnpickEpic = (action$: Observable<AssetsActions>): Observable<AssetsActions> =>
  action$.pipe(
    filter(
      isOfType([
        AssetsActionTypes.SEARCH_FACETS_ADD,
        AssetsActionTypes.SEARCH_FACETS_CLEAR,
        AssetsActionTypes.SEARCH_FACETS_REMOVE,
        AssetsActionTypes.SEARCH_FACETS_UPDATE,
        AssetsActionTypes.SET_ORDER,
        AssetsActionTypes.SET_SEARCH_QUERY,
        AssetsActionTypes.SET_VIEW
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
      const {asset, formData, options} = action.payload

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => from(client.patch(asset._id).set(formData).commit())),
        mergeMap((updatedAsset: any) => of(assetsUpdateComplete(updatedAsset._id, options))),
        catchError(error => of(assetsUpdateError(asset, error)))
      )
    })
  )

/*********
 * UTILS *
 *********/

/**
 * Construct GROQ filter based off search facets and query
 */

const constructFilter = (searchFacets: SearchFacetInputProps[], searchQuery?: string) => {
  const baseFilter = groq`_type == "sanity.imageAsset" && !(_id in path("drafts.**"))` // all images

  const searchFacetFragments = searchFacets.reduce((acc: string[], facet) => {
    const {operatorType} = facet
    const operator = SEARCH_FACET_OPERATORS[operatorType]

    if (facet.type === 'number') {
      const {field, modifier, options, value} = facet

      // Get current modifier
      const currentModifier = options?.modifiers?.find(m => m.name === modifier)

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
      const {field, value} = facet

      const fragment = operator.fn(value?.value, field)
      if (fragment) {
        acc.push(fragment)
      }
    }

    if (facet.type === 'select') {
      const {options, value} = facet

      const currentListValue = options?.list?.find(l => l.name === value)?.value

      const fragment = operator.fn(currentListValue)
      if (fragment) {
        acc.push(fragment)
      }
    }

    if (facet.type === 'string') {
      const {field, value} = facet

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
    // NOTE: Currently this only searches direct fields on sanity.imageAsset and NOT referenced tags
    // It's possible to add this by adding the following line to the searchQuery, but it's quite slow
    // references(*[_type == "mediaTag" && name.current == "${searchQuery.trim()}"]._id)
    ...(searchQuery
      ? [groq`[altText, description, originalFilename, title] match '*${searchQuery.trim()}*'`]
      : []),
    // Search facets
    ...searchFacetFragments
  ].join(' && ')

  return constructedQuery
}
