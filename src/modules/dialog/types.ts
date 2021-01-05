import {Dialog} from '@types'

import {DialogActionTypes} from './index'

// Reducer

export type DialogReducerState = {
  items: Dialog[]
}

// Actions

export type DialogClearAction = {
  type: DialogActionTypes.CLEAR
}

export type DialogRemoveAction = {
  payload: {
    id: string
  }
  type: DialogActionTypes.REMOVE
}

export type DialogShowDetailsAction = {
  payload: {
    assetId: string
  }
  type: DialogActionTypes.SHOW_DETAILS
}

export type DialogShowDeleteConfirmAction = {
  payload: {
    assetId?: string
    options?: {
      closeDialogId?: string
    }
  }
  type: DialogActionTypes.SHOW_DELETE_CONFIRM
}

export type DialogShowSearchFacetsAction = {
  type: DialogActionTypes.SHOW_SEARCH_FACETS
}

// All actions

export type DialogActions =
  | DialogClearAction
  | DialogRemoveAction
  | DialogShowDeleteConfirmAction
  | DialogShowDetailsAction
  | DialogShowSearchFacetsAction
