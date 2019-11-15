import produce from 'immer'
import {ofType, ActionsObservable} from 'redux-observable'
import {from, of, empty} from 'rxjs'
import {catchError, mergeAll, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import client from 'part:@sanity/base/client'
import {Asset, DeleteHandleTarget, FetchOptions} from '../../types'
import {
  AssetsActions,
  AssetsReducerState,
  // AssetsFetchRequestAction,
  AssetsDeleteRequestAction
  // AssetsDeletePickedAction
} from './types'
// import {RootReducerState} from '../types'

/***********
 * ACTIONS *
 ***********/

export enum AssetsActionTypes {
  DELETE_COMPLETE = 'ASSETS_DELETE_COMPLETE',
  DELETE_ERROR = 'ASSETS_DELETE_ERROR',
  DELETE_PICKED = 'ASSETS_DELETE_PICKED',
  DELETE_REQUEST = 'ASSETS_DELETE_REQUEST',
  FETCH_COMPLETE = 'ASSETS_FETCH_COMPLETE',
  FETCH_ERROR = 'ASSETS_FETCH_ERROR',
  FETCH_REQUEST = 'ASSETS_FETCH_REQUEST',
  PICK = 'ASSETS_PICK',
  PICK_ALL = 'ASSETS_PICK_ALL',
  PICK_CLEAR = 'ASSETS_PICK_CLEAR',
  UNCAUGHT_EXCEPTION = 'ASSETS_UNCAUGHT_EXCEPTION'
}

/***********
 * REDUCER *
 ***********/

/**
 * `allIds` is an ordered array of all assetIds
 * `byIds` is an object literal that contains all normalised assets (with asset IDs as keys)
 */

const INITIAL_STATE = {
  allIds: [],
  byIds: {},
  fetching: false,
  fetchingError: null,
  totalCount: -1
}

export default function assetsReducerState(
  state: AssetsReducerState = INITIAL_STATE,
  action: AssetsActions
) {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      /**
       * An asset has been successfully deleted via the client.
       * - Delete asset from the redux store (both the normalised object and ordered assetID).
       */
      case AssetsActionTypes.DELETE_COMPLETE: {
        const assetId = action.payload?.asset?._id
        const deleteIndex = draft.allIds.indexOf(assetId)
        draft.allIds.splice(deleteIndex, 1)
        delete draft.byIds[assetId]
        draft.totalCount -= 1
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
       * - Set updating status on asset in question.
       * - Clear any existing asset errors
       */
      case AssetsActionTypes.DELETE_REQUEST: {
        const assetId = action.payload?.asset?._id
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
        const assets = action.payload?.assets
        const totalCount = action.payload?.totalCount

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
        draft.fetchingError = null
        draft.totalCount = totalCount
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
       * - If `replace` is true, we clear all existing assets (useful if we want more traditional
       * paginated browsing, e.g going between pages doesn't persist content).
       * - Set fetching status
       * - Clear any previously stored error
       */
      case AssetsActionTypes.FETCH_REQUEST:
        if (action.payload?.replace) {
          draft.allIds = []
          draft.byIds = {}
        }

        draft.fetching = true
        draft.fetchingError = null
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
        Object.keys(draft.byIds).forEach(key => {
          draft.byIds[key].picked = false
        })
        break
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// Delete started
export const assetsDelete = (asset: Asset, handleTarget: DeleteHandleTarget = 'snackbar') => ({
  payload: {
    asset,
    handleTarget
  },
  type: AssetsActionTypes.DELETE_REQUEST
})

// Delete success
export const assetsDeleteComplete = (asset: Asset) => ({
  payload: {
    asset
  },
  type: AssetsActionTypes.DELETE_COMPLETE
})

// Delete error
// TODO: use correct type
export const assetsDeleteError = (asset: Asset, error: any, handleTarget: DeleteHandleTarget) => ({
  payload: {
    asset,
    handleTarget,
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
 * @param {Boolean} [options.replace] - Whether the results of this should replace all existing assets
 * @param {String} [options.selector] - GROQ selector / range
 * @param {String} [options.sort] - GROQ sort
 */
export const assetsFetch = ({
  filter = `_type == "sanity.imageAsset"`,
  params = {},
  projections = `{
    _id,
    metadata {dimensions},
    originalFilename,
    url
  }`,
  replace = true,
  selector = ``,
  sort = `order(_updatedAt desc)`
}: FetchOptions) => {
  const pipe = sort || selector ? '|' : ''

  // Construct query
  const query = `//groq
    {
      "items": *[${filter}] ${projections} ${pipe} ${sort} ${selector},
      "totalCount": count(*[${filter}] {})
    }
  `

  return {
    payload: {
      params,
      replace,
      query
    },
    type: AssetsActionTypes.FETCH_REQUEST
  }
}

// Fetch complete
export const assetsFetchComplete = (assets: Asset[], replace: boolean, totalCount: number) => ({
  payload: {
    assets,
    replace,
    totalCount
  },
  type: AssetsActionTypes.FETCH_COMPLETE
})

// Fetch failed
// TODO: use correct type
export const assetsFetchError = (error: any) => ({
  payload: {
    error
  },
  type: AssetsActionTypes.FETCH_ERROR
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

/*********
 * EPICS *
 *********/

/**
 * List for asset delete requests:
 * - make async call to `client.delete`
 * - return a corresponding success or error action
 */
export const assetsDeleteEpic = (action$: ActionsObservable<AssetsDeleteRequestAction>) =>
  action$.pipe(
    ofType(AssetsActionTypes.DELETE_REQUEST),
    mergeMap(action => {
      return of(action).pipe(
        mergeMap(() => {
          const assetId = action.payload?.asset?._id
          return from(client.delete(assetId))
        }),
        mergeMap(() => {
          const asset = action.payload?.asset
          return of(assetsDeleteComplete(asset))
        }),
        catchError(error => {
          const asset = action.payload?.asset
          const handleTarget = action.payload?.handleTarget
          return of(assetsDeleteError(asset, error, handleTarget))
        })
      )
    })
  )

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
    mergeMap((asset: any) => of(assetsDelete(asset, 'snackbar')))
  )

/**
 * Listen for fetch requests:
 * - make async call to `client.fetch`
 * - return a corresponding success or error action
 */
export const assetsFetchEpic = (action$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.FETCH_REQUEST),
    switchMap((action: any) => {
      return of(action).pipe(
        mergeMap(() => {
          const params = action.payload?.params
          const query = action.payload?.query
          return from(client.fetch(query, params))
        }),
        mergeMap((result: any) => {
          const {items, totalCount} = result

          const replace = action.payload?.replace
          return of(assetsFetchComplete(items, replace, totalCount))
        }),
        catchError(error => of(assetsFetchError(error)))
      )
    })
  )
