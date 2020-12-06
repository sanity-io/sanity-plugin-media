import {Asset} from '@types'
import {DialogActionTypes} from './index'

// Reducer

export type DialogReducerState = {
  asset?: Asset | null
  type: 'refs' | null
}

// Actions

export type DialogClearAction = {
  type: DialogActionTypes.CLEAR
}

export type DialogShowRefsAction = {
  payload: {
    asset: Asset
  }
  type: DialogActionTypes.SHOW_REFS
}

// All actions

export type DialogActions = DialogClearAction | DialogShowRefsAction
