import {Asset} from '@types'
import produce from 'immer'
import {ofType} from 'redux-observable'
import {of} from 'rxjs'
import {filter, mergeMap, withLatestFrom} from 'rxjs/operators'

import {AssetsActionTypes} from '../assets'
import {DialogActions, DialogReducerState} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DialogActionTypes {
  CLEAR = 'DIALOG_CLEAR',
  SHOW_DELETE_PICKED_CONFIRM = 'DIALOG_SHOW_DELETE_PICKED_CONFIRM',
  SHOW_DETAILS = 'DIALOG_SHOW_DETAILS',
  SHOW_SEARCH_FACETS = 'DIALOG_SHOW_SEARCH_FACETS'
}

/***********
 * REDUCER *
 ***********/

/**
 * `asset` is a Sanity asset, which dialogs reference to display contextual information
 * `type` can be of type 'details':
 * - `details` displays all asset details
 */

const INITIAL_STATE = {
  asset: null,
  type: null
}

export default function dialogReducer(
  state: DialogReducerState = INITIAL_STATE,
  action: DialogActions
) {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case DialogActionTypes.CLEAR:
        draft.asset = null
        draft.type = null
        break
      case DialogActionTypes.SHOW_DETAILS: {
        const asset = action.payload?.asset
        draft.asset = asset
        draft.type = 'details'
        break
      }
      case DialogActionTypes.SHOW_DELETE_PICKED_CONFIRM:
        draft.type = 'deletePickedConfirm'
        break
      case DialogActionTypes.SHOW_SEARCH_FACETS:
        draft.type = 'searchFacets'
        break
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

/**
 * Clear dialog
 */

export const dialogClear = () => ({
  payload: {
    asset: null
  },
  type: DialogActionTypes.CLEAR
})

/**
 * Display asset details
 */

export const dialogShowDetails = (asset: Asset) => ({
  payload: {
    asset
  },
  type: DialogActionTypes.SHOW_DETAILS
})

/**
 * Display search facets
 */

export const dialogShowSearchFacets = () => ({
  type: DialogActionTypes.SHOW_SEARCH_FACETS
})

export const dialogShowDeletePickedConfirm = () => ({
  type: DialogActionTypes.SHOW_DELETE_PICKED_CONFIRM
})

/*********
 * EPICS *
 *********/

/**
 * Listen for successful asset deletion:
 * - Clear dialog if the current dialog asset matches recently deleted asset
 */

export const dialogClearEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.DELETE_COMPLETE),
    withLatestFrom(state$),
    filter(([action, state]) => {
      const dialogAssetId = state.dialog?.asset?._id
      const assetId = action.payload?.asset?._id

      return assetId === dialogAssetId
    }),
    mergeMap(() => {
      return of(dialogClear())
    })
  )
