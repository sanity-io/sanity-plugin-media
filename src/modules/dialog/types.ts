import {Asset, AssetItem, Dialog, Tag} from '@types'

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

export type DialogShowConfirmAssetsTagAddAction = {
  payload: {
    assetsPicked: AssetItem[]
    closeDialogId?: string
    tag: Tag
  }
  type: DialogActionTypes.SHOW_CONFIRM_ASSETS_TAG_ADD
}

export type DialogShowConfirmAssetsTagRemoveAction = {
  payload: {
    assetsPicked: AssetItem[]
    closeDialogId?: string
    tag: Tag
  }
  type: DialogActionTypes.SHOW_CONFIRM_ASSETS_TAG_REMOVE
}

export type DialogShowConfirmDeleteAssetAction = {
  payload: {
    asset: Asset
    closeDialogId?: string
  }
  type: DialogActionTypes.SHOW_CONFIRM_DELETE_ASSET
}

export type DialogShowConfirmDeleteAssetsPickedAction = {
  payload: {
    assetsPicked: AssetItem[]
    closeDialogId?: string
  }
  type: DialogActionTypes.SHOW_CONFIRM_DELETE_ASSETS_PICKED
}

export type DialogShowConfirmDeleteTagAction = {
  payload: {
    closeDialogId?: string
    tag: Tag
  }
  type: DialogActionTypes.SHOW_CONFIRM_DELETE_TAG
}

export type DialogShowDetailsAction = {
  payload: {
    assetId: string
  }
  type: DialogActionTypes.SHOW_DETAILS
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
  | DialogShowConfirmAssetsTagAddAction
  | DialogShowConfirmAssetsTagRemoveAction
  | DialogShowConfirmDeleteAssetAction
  | DialogShowConfirmDeleteAssetsPickedAction
  | DialogShowConfirmDeleteTagAction
  | DialogShowDetailsAction
  | DialogShowSearchFacetsAction
  | DialogShowTagCreateAction
  | DialogShowTagEditAction
  | DialogShowTagsAction
