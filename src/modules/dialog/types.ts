import {Dialog} from '@types'

import {DialogActionTypes} from './index'

// Reducer

export type DialogReducerState = {
  items: Dialog[]
}

// Actions

export type DialogAddCreatedTagAction = {
  payload: {
    assetId: string
    tagId: string
  }
  type: DialogActionTypes.ADD_CREATED_TAG
}

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
    closeDialogId?: string
    documentId?: string
    documentType: 'asset' | 'tag'
  }
  type: DialogActionTypes.SHOW_DELETE_CONFIRM
}

export type DialogShowSearchFacetsAction = {
  type: DialogActionTypes.SHOW_SEARCH_FACETS
}

export type DialogShowTagCreateAction = {
  type: DialogActionTypes.SHOW_TAG_CREATE
}

export type DialogShowTagEditAction = {
  payload: {
    closeDialogId?: string
    tagId: string
  }
  type: DialogActionTypes.SHOW_TAG_EDIT
}

export type DialogShowTagsAction = {
  type: DialogActionTypes.SHOW_TAGS
}

// All actions

export type DialogActions =
  | DialogAddCreatedTagAction
  | DialogClearAction
  | DialogRemoveAction
  | DialogShowDeleteConfirmAction
  | DialogShowDetailsAction
  | DialogShowSearchFacetsAction
  | DialogShowTagCreateAction
  | DialogShowTagEditAction
  | DialogShowTagsAction
