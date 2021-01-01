import {Asset, BrowserView, FetchOptions, Order, SearchFacetProps} from '@types'
import groq from 'groq'
import produce from 'immer'
import {ofType, ActionsObservable} from 'redux-observable'
import {from, empty, iif, interval, of, throwError, Observable} from 'rxjs'
import {
  catchError,
  debounceTime,
  delay,
  mergeAll,
  mergeMap,
  switchMap,
  withLatestFrom
} from 'rxjs/operators'
import client from 'part:@sanity/base/client'

import {BROWSER_SELECT} from '../../config'
import {COMPARISON_OPERATOR_MAPPING} from '../../constants'
import {AssetsActions, AssetsReducerState, AssetsDeleteRequestAction} from './types'

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
 * `allIds` is an ordered array of all assetIds
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
  order: BROWSER_SELECT[0]?.order,
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
) {
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
        draft.byIds = {}
        break

      /**
       * An asset has been successfully deleted via the client.
       * - Delete asset from the redux store (both the normalised object and ordered assetID).
       */
      case AssetsActionTypes.DELETE_COMPLETE: {
        const assetId = action.payload?.asset?._id
        const deleteIndex = draft.allIds.indexOf(assetId)
        draft.allIds.splice(deleteIndex, 1)
        draft.lastTouched = new Date().getTime()
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
       * All assets have been picked.
       */
      case AssetsActionTypes.PICK_ALL:
        Object.keys(draft.byIds).forEach(key => {
          draft.byIds[key].picked = true
        })
        break
      /**
       * All assets have been unpicked.
       */
      case AssetsActionTypes.PICK_CLEAR:
        draft.lastPicked = undefined
        Object.keys(draft.byIds).forEach(key => {
          draft.byIds[key].picked = false
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

      /**
       * An asset has been successfully updated via the client.
       * - Update asset in `byIds`
       */
      case AssetsActionTypes.UPDATE_COMPLETE: {
        const asset = action.payload?.asset
        draft.byIds[asset._id] = {
          asset,
          picked: false,
          updating: false
        }
        draft.lastTouched = new Date().getTime()
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
export const assetsClear = () => ({
  type: AssetsActionTypes.CLEAR
})

// Delete started
export const assetsDelete = (
  asset: Asset,
  options?: {
    closeDialogId?: string
  }
) => ({
  payload: {
    asset,
    options
  },
  type: AssetsActionTypes.DELETE_REQUEST
})

// Delete success
export const assetsDeleteComplete = (asset: Asset, options?: {closeDialogId?: string}) => ({
  payload: {
    asset,
    options
  },
  type: AssetsActionTypes.DELETE_COMPLETE
})

// Delete error
export const assetsDeleteError = (asset: Asset, error: any) => ({
  payload: {
    asset,
    error
  },
  type: AssetsActionTypes.DELETE_ERROR
})

// Delete all picked assets
export const assetsDeletePicked = () => ({
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
  filter = groq`_type == "sanity.imageAsset"`,
  params = {},
  projections = groq`{
    _id,
    metadata {dimensions},
    originalFilename,
    url
  }`,
  selector = ``,
  sort = groq`order(_updatedAt desc)`
}: FetchOptions) => {
  const pipe = sort || selector ? '|' : ''

  // Construct query
  const query = groq`
    {
      "items": *[${filter}] ${projections} ${pipe} ${sort} ${selector},
    }
  `

  return {
    payload: {
      params,
      query
    },
    type: AssetsActionTypes.FETCH_REQUEST
  }
}

// Fetch complete
export const assetsFetchComplete = (
  assets: Asset[]
  // totalCount: number
) => ({
  payload: {
    assets
    // totalCount
  },
  type: AssetsActionTypes.FETCH_COMPLETE
})

// Fetch failed
export const assetsFetchError = (error: any) => ({
  payload: {
    error
  },
  type: AssetsActionTypes.FETCH_ERROR
})

// Load page assets at page index
export const assetsLoadPageIndex = (pageIndex: number) => ({
  payload: {
    pageIndex
  },
  type: AssetsActionTypes.LOAD_PAGE_INDEX
})

// Load next page
export const assetsLoadNextPage = () => ({
  type: AssetsActionTypes.LOAD_NEXT_PAGE
})

// Pick asset
export const assetsPick = (assetId: string, picked: boolean) => ({
  payload: {
    assetId,
    picked
  },
  type: AssetsActionTypes.PICK
})

// Pick all assets
export const assetsPickAll = () => ({
  type: AssetsActionTypes.PICK_ALL
})

// Unpick all assets
export const assetsPickClear = () => ({
  type: AssetsActionTypes.PICK_CLEAR
})

// Pick a range of assets
export const assetsPickRange = (startId: string, endId: string) => ({
  payload: {
    endId,
    startId
  },
  type: AssetsActionTypes.PICK_RANGE
})

// Add search facet
export const assetsSearchFacetsAdd = (facet: SearchFacetProps) => ({
  payload: {
    facet
  },
  type: AssetsActionTypes.SEARCH_FACETS_ADD
})

// Clear search facets
export const assetsSearchFacetsClear = () => ({
  type: AssetsActionTypes.SEARCH_FACETS_CLEAR
})

// Remove search facet
export const assetsSearchFacetsRemove = (facetName: string) => ({
  payload: {
    facetName
  },
  type: AssetsActionTypes.SEARCH_FACETS_REMOVE
})

// Update search facet
export const assetsSearchFacetsUpdate = (facet: SearchFacetProps) => ({
  payload: {
    facet
  },
  type: AssetsActionTypes.SEARCH_FACETS_UPDATE
})

// Set view mode
export const assetsSetView = (view: BrowserView) => ({
  payload: {
    view
  },
  type: AssetsActionTypes.SET_VIEW
})

// Set order
export const assetsSetOrder = (order: Order) => ({
  payload: {
    order
  },
  type: AssetsActionTypes.SET_ORDER
})

// Set search query
export const assetsSetSearchQuery = (searchQuery: string) => ({
  payload: {
    searchQuery
  },
  type: AssetsActionTypes.SET_SEARCH_QUERY
})

// Update started
export const assetsUpdate = (
  asset: Asset,
  formData: Record<string, any>,
  options?: {
    closeDialogId?: string
  }
) => ({
  payload: {
    asset,
    formData,
    options
  },
  type: AssetsActionTypes.UPDATE_REQUEST
})

// Delete success
export const assetsUpdateComplete = (asset: Asset, options?: {closeDialogId?: string}) => ({
  payload: {
    asset,
    options
  },
  type: AssetsActionTypes.UPDATE_COMPLETE
})

// Delete error
export const assetsUpdateError = (asset: Asset, error: any) => ({
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
export const assetsDeleteEpic = (action$: any, state$: any) => {
  return action$.pipe(
    ofType(AssetsActionTypes.DELETE_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const asset = action.payload?.asset
      return of(action).pipe(
        debugThrottle(action, state.debug.badConnection),
        mergeMap(() => from(client.delete(asset._id))),
        mergeMap(() => of(assetsDeleteComplete(asset))),
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
export const assetsDeletePickedEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.DELETE_PICKED),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const availableItems = Object.entries(state.assets.byIds).filter(([, value]: [any, any]) => {
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
export const assetsFetchEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.FETCH_REQUEST),
    withLatestFrom(state$),
    switchMap(([action, state]: [any, any]) => {
      const params = action.payload?.params
      const query = action.payload?.query

      return of(action).pipe(
        debugThrottle(action, state.debug.badConnection),
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
export const assetsFetchPageIndexEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.LOAD_PAGE_INDEX),
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
            extension,
            metadata {
              dimensions,
              isOpaque,
            },
            mimeType,
            originalFilename,
            size,
            url
          }`,
          selector: groq`[${start}...${end}]`,
          sort: groq`order(${state.assets.order.field} ${state.assets.order.direction})`
        })
      )
    })
  )

/**
 * Listen for changes to order, filter and search query
 * - Clear assets
 * - Load first page
 */
export const assetsFetchNextPageEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.LOAD_NEXT_PAGE),
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
export const assetsSearchEpic = (action$: any) =>
  action$.pipe(
    ofType(
      AssetsActionTypes.SEARCH_FACETS_ADD,
      AssetsActionTypes.SEARCH_FACETS_CLEAR,
      AssetsActionTypes.SEARCH_FACETS_REMOVE,
      AssetsActionTypes.SEARCH_FACETS_UPDATE,
      AssetsActionTypes.SET_SEARCH_QUERY
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
export const assetsSetOrderEpic = (action$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.SET_ORDER),
    switchMap(() => {
      return of(assetsClear(), assetsLoadPageIndex(0))
    })
  )

/**
 * Listen for asset update requests:
 * - make async call to `client.patch`
 * - return a corresponding success or error action
 */
export const assetsUpdateEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.UPDATE_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {asset, formData, options} = action.payload

      return of(action).pipe(
        debugThrottle(action, state.debug.badConnection),
        mergeMap(() => from(client.patch(asset._id).set(formData).commit())),
        mergeMap((updatedAsset: any) => {
          return of(assetsUpdateComplete(updatedAsset, options))
        }),
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

const constructFilter = (searchFacets: SearchFacetProps[], searchQuery?: string) => {
  const baseFilter = groq`_type == "sanity.imageAsset"` // all images

  const searchFacetFragments = searchFacets.map(facet => {
    if (facet.type === 'number') {
      const {field, modifier, operators, options, value} = facet

      // Get current modifier
      const currentModifier = options?.modifiers.find(m => m.name === modifier)

      // Apply modifier fn (if present)
      const modifiedValue = currentModifier ? currentModifier?.fn(value) : value

      return `${field} ${COMPARISON_OPERATOR_MAPPING[operators.comparison].value} ${modifiedValue}`
    }

    if (facet.type === 'select') {
      const {operators, options, value} = facet

      const currentListValue = options?.list.find(l => l.name === value)?.value

      if (operators.logical === 'not') {
        return `!(${currentListValue})`
      }

      return currentListValue
    }

    throw Error(`type must be either 'number' or 'select'`)
  })

  // Join separate filter fragments
  const constructedQuery = [
    // Base filter
    baseFilter,
    // Search query (if present)
    ...(searchQuery ? [groq` originalFilename match '*${searchQuery.trim()}*'`] : []),
    // Search facets
    ...searchFacetFragments
  ].join(' && ')

  return constructedQuery
}

const debugThrottle = (action: any, throttled: boolean) => {
  return mergeMap(action => {
    return iif(
      () => throttled,
      of(action).pipe(
        delay(5000),
        mergeMap(action => {
          if (Math.random() > 0.5) {
            return throwError('Test error')
          }
          return of(action)
        })
      ),
      of(action)
    )
  })
}
