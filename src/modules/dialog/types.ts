import {Asset} from '@types'
import {DialogActionTypes} from './index'

// Reducer

export type DialogReducerState = {
  asset?: Asset | null
  type: 'details' | null
}

// Actions

export type DialogClearAction = {
  type: DialogActionTypes.CLEAR
}

export type DialogShowDetailsAction = {
  payload: {
    asset: Asset
  }
  type: DialogActionTypes.SHOW_DETAILS
}

// All actions

export type DialogActions = DialogClearAction | DialogShowDetailsAction
