import {Asset} from '@types'
import {DialogActionTypes} from './index'

// Reducer

export type DialogReducerState = {
  asset?: Asset | null
  type: 'deletePickedConfirm' | 'details' | 'searchFacets' | null
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

export type DialogShowDeletePickedConfirmAction = {
  type: DialogActionTypes.SHOW_DELETE_PICKED_CONFIRM
}

export type DialogShowSearchFacetsAction = {
  type: DialogActionTypes.SHOW_SEARCH_FACETS
}

// All actions

export type DialogActions =
  | DialogClearAction
  | DialogShowDeletePickedConfirmAction
  | DialogShowDetailsAction
  | DialogShowSearchFacetsAction
