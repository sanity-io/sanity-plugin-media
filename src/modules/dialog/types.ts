import {Asset} from '../../types'
import {DialogActionTypes} from './index'

// Reducer

export type DialogReducerState = {
  asset?: Asset | null
  type: 'conflicts' | 'refs' | null
}

// Actions

export type DialogClearAction = {
  type: DialogActionTypes.CLEAR
}

export type DialogShowConflictsAction = {
  payload: {
    asset: Asset
  }
  type: DialogActionTypes.SHOW_CONFLICTS
}

export type DialogShowRefsAction = {
  payload: {
    asset: Asset
  }
  type: DialogActionTypes.SHOW_REFS
}

// All actions

export type DialogActions = DialogClearAction | DialogShowConflictsAction | DialogShowRefsAction
