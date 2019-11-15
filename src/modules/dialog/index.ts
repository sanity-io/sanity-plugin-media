import produce from 'immer'
import {ofType} from 'redux-observable'
import {of} from 'rxjs'
import {filter, mergeMap, withLatestFrom} from 'rxjs/operators'
import {AssetsActionTypes} from '../assets'
import {DialogActions, DialogReducerState} from './types'
import {Asset} from '../../types'

/***********
 * ACTIONS *
 ***********/

export enum DialogActionTypes {
  CLEAR = 'DIALOG_CLEAR',
  SHOW_CONFLICTS = 'DIALOG_SHOW_CONFLICTS',
  SHOW_REFS = 'DIALOG_SHOW_REFS'
}

/***********
 * REDUCER *
 ***********/

/**
 * `asset` is a Sanity asset, which dialogs reference to display contextual information
 * `type` can be of type 'conflicts' or 'refs':
 * - `refs` displays all asset references, with an option to delete
 * - 'conflicts' is the same as refs, except rendered as a danger dialog with no option to delete
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
      case DialogActionTypes.SHOW_CONFLICTS: {
        const asset = action.payload?.asset
        draft.asset = asset
        draft.type = 'conflicts'
        break
      }
      case DialogActionTypes.SHOW_REFS: {
        const asset = action.payload?.asset
        draft.asset = asset
        draft.type = 'refs'
        break
      }
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
 * Display asset conflict dialog
 */

export const dialogShowConflicts = (asset: Asset) => ({
  payload: {
    asset
  },
  type: DialogActionTypes.SHOW_CONFLICTS
})

/**
 * Display asset references
 */

export const dialogShowRefs = (asset: Asset) => ({
  payload: {
    asset
  },
  type: DialogActionTypes.SHOW_REFS
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

/**
 * Listen for asset delete errors:
 * - Show error dialog if `handleTarget === 'dialog'`
 */

export const dialogShowConflictsEpic = (action$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.DELETE_ERROR),
    filter((action: any) => {
      const handleTarget = action.payload?.handleTarget
      return handleTarget === 'dialog'
    }),
    mergeMap((action: any) => {
      const asset = action.payload?.asset
      return of(dialogShowConflicts(asset))
    })
  )
