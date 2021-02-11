import produce from 'immer'
import pluralize from 'pluralize'
import React from 'react'
import {empty, Observable, of} from 'rxjs'
import {filter, mergeMap} from 'rxjs/operators'
import {isOfType} from 'typesafe-actions'

import {Asset, AssetItem, Tag} from '../../types'

import {
  AssetsActionTypes,
  assetsTagsAdd,
  assetsDelete,
  assetsDeletePicked,
  assetsTagsRemove
} from '../assets'
import {AssetsActions} from '../assets/types'
import {TagsActionTypes, tagsDelete} from '../tags'
import {TagsActions} from '../tags/types'
import {
  DialogAddCreatedTagAction,
  DialogActions,
  DialogClearAction,
  DialogReducerState,
  DialogRemoveAction,
  DialogShowConfirmAssetsTagAddAction,
  DialogShowConfirmDeleteAssetAction,
  DialogShowConfirmDeleteAssetsPickedAction,
  DialogShowConfirmDeleteTagAction,
  DialogShowConfirmAssetsTagRemoveAction,
  DialogShowDetailsAction,
  DialogShowSearchFacetsAction,
  DialogShowTagCreateAction,
  DialogShowTagEditAction,
  DialogShowTagsAction
} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DialogActionTypes {
  ADD_CREATED_TAG = 'DIALOG_ADD_CREATED_TAG',
  CLEAR = 'DIALOG_CLEAR',
  CONFIRM = 'DIALOG_CONFIRM',
  REMOVE = 'DIALOG_REMOVE',
  SHOW_CONFIRM_ASSETS_TAG_ADD = 'DIALOG_SHOW_CONFIRM_ASSETS_TAG_ADD',
  SHOW_CONFIRM_ASSETS_TAG_REMOVE = 'DIALOG_SHOW_CONFIRM_ASSETS_TAG_REMOVE',
  SHOW_CONFIRM_DELETE_ASSET = 'DIALOG_SHOW_CONFIRM_DELETE_ASSET',
  SHOW_CONFIRM_DELETE_ASSETS_PICKED = 'DIALOG_SHOW_CONFIRM_DELETE_ASSETS_PICKED',
  SHOW_CONFIRM_DELETE_TAG = 'DIALOG_SHOW_CONFIRM_DELETE_TAG',
  SHOW_DETAILS = 'DIALOG_SHOW_DETAILS',
  SHOW_SEARCH_FACETS = 'DIALOG_SHOW_SEARCH_FACETS',
  SHOW_TAG_CREATE = 'DIALOG_SHOW_TAG_CREATE',
  SHOW_TAG_EDIT = 'DIALOG_SHOW_TAG_EDIT',
  SHOW_TAGS = 'DIALOG_SHOW_TAGS'
}

/***********
 * REDUCER *
 ***********/

const INITIAL_STATE = {
  items: []
}

export default function dialogReducer(
  state: DialogReducerState = INITIAL_STATE,
  action: DialogActions
): DialogReducerState {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case DialogActionTypes.ADD_CREATED_TAG:
        draft.items.forEach(item => {
          if (item.type === 'assetEdit' && item.assetId === action.payload.assetId) {
            item.lastCreatedTagId = action.payload.tagId
          }
        })
        break
      case DialogActionTypes.CLEAR:
        draft.items = []
        break
      case DialogActionTypes.REMOVE: {
        const id = action.payload?.id
        draft.items = draft.items.filter(item => item.id !== id)
        break
      }
      case DialogActionTypes.SHOW_DETAILS: {
        const {assetId} = action.payload
        draft.items.push({
          assetId,
          id: assetId,
          type: 'assetEdit'
        })
        break
      }

      case DialogActionTypes.SHOW_CONFIRM_ASSETS_TAG_ADD: {
        const {assetsPicked, closeDialogId, tag} = action.payload

        const suffix = `${assetsPicked.length} ${pluralize('asset', assetsPicked.length)}`

        draft.items.push({
          closeDialogId,
          confirmCallbackAction: assetsTagsAdd({
            assets: assetsPicked,
            tag
          }),
          confirmText: `Yes, add tag to ${suffix}`,
          title: (
            <span>
              Add tag <span style={{fontWeight: 600}}>{tag.name.current}</span> to {suffix}?
            </span>
          ),
          id: 'confirm',
          headerTitle: 'Confirm tag addition',
          tone: 'primary',
          type: 'confirm'
        })
        break
      }

      case DialogActionTypes.SHOW_CONFIRM_DELETE_ASSET: {
        const {asset, closeDialogId} = action.payload

        const suffix = 'asset'

        draft.items.push({
          closeDialogId,
          confirmCallbackAction: assetsDelete({asset}),
          confirmText: `Yes, delete ${suffix}`,
          description: 'This operation cannot be reversed. Are you sure you want to continue?',
          title: `Permanently delete ${suffix}?`,
          id: 'confirm',
          headerTitle: 'Confirm deletion',
          tone: 'critical',
          type: 'confirm'
        })
        break
      }

      case DialogActionTypes.SHOW_CONFIRM_DELETE_ASSETS_PICKED: {
        const {assetsPicked, closeDialogId} = action.payload

        const suffix = `${assetsPicked.length} ${pluralize('asset', assetsPicked.length)}`

        draft.items.push({
          closeDialogId,
          confirmCallbackAction: assetsDeletePicked(),
          confirmText: `Yes, delete ${suffix}`,
          description: 'This operation cannot be reversed. Are you sure you want to continue?',
          title: `Permanently delete ${suffix}?`,
          id: 'confirm',
          headerTitle: 'Confirm deletion',
          tone: 'critical',
          type: 'confirm'
        })
        break
      }

      case DialogActionTypes.SHOW_CONFIRM_DELETE_TAG: {
        const {closeDialogId, tag} = action.payload

        const suffix = 'tag'

        draft.items.push({
          closeDialogId,
          confirmCallbackAction: tagsDelete(tag),
          confirmText: `Yes, delete ${suffix}`,
          description: 'This operation cannot be reversed. Are you sure you want to continue?',
          title: `Permanently delete ${suffix}?`,
          id: 'confirm',
          headerTitle: 'Confirm deletion',
          tone: 'critical',
          type: 'confirm'
        })
        break
      }

      case DialogActionTypes.SHOW_CONFIRM_ASSETS_TAG_REMOVE: {
        const {assetsPicked, closeDialogId, tag} = action.payload

        const suffix = `${assetsPicked.length} ${pluralize('asset', assetsPicked.length)}`

        draft.items.push({
          closeDialogId,
          confirmCallbackAction: assetsTagsRemove({assets: assetsPicked, tag}),
          confirmText: `Yes, remove tag from ${suffix}`,
          headerTitle: 'Confirm tag removal',
          id: 'confirm',
          title: (
            <span>
              Remove tag <span style={{fontWeight: 600}}>{tag.name.current}</span> from {suffix}?
            </span>
          ),
          tone: 'primary',
          type: 'confirm'
        })
        break
      }

      case DialogActionTypes.SHOW_SEARCH_FACETS:
        draft.items.push({
          id: 'searchFacets',
          type: 'searchFacets'
        })
        break
      case DialogActionTypes.SHOW_TAGS:
        draft.items.push({
          id: 'tags',
          type: 'tags'
        })
        break
      case DialogActionTypes.SHOW_TAG_CREATE:
        draft.items.push({
          id: 'tagCreate',
          type: 'tagCreate'
        })
        break
      case DialogActionTypes.SHOW_TAG_EDIT: {
        const {tagId} = action.payload
        draft.items.push({
          id: String(tagId), // TODO: double check casting
          tagId,
          type: 'tagEdit'
        })
        break
      }
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

/**
 * Add created tag to edit dialog
 */

export const dialogAddCreatedTag = ({
  assetId,
  tagId
}: {
  assetId: string
  tagId: string
}): DialogAddCreatedTagAction => ({
  payload: {assetId, tagId},
  type: DialogActionTypes.ADD_CREATED_TAG
})

/**
 * Clear all dialogs
 */
export const dialogClear = (): DialogClearAction => ({
  type: DialogActionTypes.CLEAR
})

/**
 * Clear dialog with ID
 */
export const dialogRemove = (id: string): DialogRemoveAction => ({
  payload: {id},
  type: DialogActionTypes.REMOVE
})

export const dialogShowConfirmAssetsTagAdd = ({
  assetsPicked,
  closeDialogId,
  tag
}: {
  assetsPicked: AssetItem[]
  closeDialogId?: string
  tag: Tag
}): DialogShowConfirmAssetsTagAddAction => ({
  payload: {
    assetsPicked,
    closeDialogId,
    tag
  },
  type: DialogActionTypes.SHOW_CONFIRM_ASSETS_TAG_ADD
})

export const dialogShowConfirmAssetsTagRemove = ({
  assetsPicked,
  closeDialogId,
  tag
}: {
  assetsPicked: AssetItem[]
  closeDialogId?: string
  tag: Tag
}): DialogShowConfirmAssetsTagRemoveAction => ({
  payload: {
    assetsPicked,
    closeDialogId,
    tag
  },
  type: DialogActionTypes.SHOW_CONFIRM_ASSETS_TAG_REMOVE
})

export const dialogShowConfirmDeleteAsset = ({
  asset,
  closeDialogId
}: {
  asset: Asset
  closeDialogId?: string
}): DialogShowConfirmDeleteAssetAction => ({
  payload: {
    asset,
    closeDialogId
  },
  type: DialogActionTypes.SHOW_CONFIRM_DELETE_ASSET
})

export const dialogShowConfirmDeleteAssetsPicked = ({
  assetsPicked,
  closeDialogId
}: {
  assetsPicked: AssetItem[]
  closeDialogId?: string
}): DialogShowConfirmDeleteAssetsPickedAction => ({
  payload: {
    assetsPicked,
    closeDialogId
  },
  type: DialogActionTypes.SHOW_CONFIRM_DELETE_ASSETS_PICKED
})

export const dialogShowConfirmDeleteTag = ({
  closeDialogId,
  tag
}: {
  closeDialogId?: string
  tag: Tag
}): DialogShowConfirmDeleteTagAction => ({
  payload: {
    closeDialogId,
    tag
  },
  type: DialogActionTypes.SHOW_CONFIRM_DELETE_TAG
})

/**
 * Display asset details
 */
export const dialogShowDetails = (assetId: string): DialogShowDetailsAction => ({
  payload: {assetId},
  type: DialogActionTypes.SHOW_DETAILS
})

/**
 * Display search facets
 */
export const dialogShowSearchFacets = (): DialogShowSearchFacetsAction => ({
  type: DialogActionTypes.SHOW_SEARCH_FACETS
})

/**
 * Display create tag
 */
export const dialogShowTagCreate = (): DialogShowTagCreateAction => ({
  type: DialogActionTypes.SHOW_TAG_CREATE
})

/**
 * Display edit tag
 */
export const dialogShowTagEdit = (tagId: string): DialogShowTagEditAction => ({
  payload: {
    tagId
  },
  type: DialogActionTypes.SHOW_TAG_EDIT
})

/**
 * Display all tags
 */
export const dialogShowTags = (): DialogShowTagsAction => ({
  type: DialogActionTypes.SHOW_TAGS
})

/*********
 * EPICS *
 *********/

/**
 * Listen for successful asset updates / deletes:
 * - Clear dialog if a dialog ID has been passed
 */
export const dialogClearOnAssetUpdateEpic = (
  action$: Observable<AssetsActions>
): Observable<DialogActions> =>
  action$.pipe(
    filter(
      isOfType([
        AssetsActionTypes.DELETE_COMPLETE,
        AssetsActionTypes.UPDATE_COMPLETE,
        TagsActionTypes.DELETE_COMPLETE,
        TagsActionTypes.UPDATE_COMPLETE
      ])
    ),
    filter(action => !!action?.payload?.closeDialogId),
    mergeMap(action => {
      const dialogId = action?.payload?.closeDialogId
      if (dialogId) {
        return of(dialogRemove(dialogId))
      } else {
        return empty()
      }
    })
  )

/**
 * Listen for successful tag creates:
 * - Clear dialog if a dialog ID has been passed
 */
export const dialogTagCreateEpic = (action$: Observable<TagsActions>): Observable<DialogActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.CREATE_COMPLETE)),
    mergeMap(action => {
      const {assetId, tag} = action?.payload

      if (assetId) {
        return of(dialogAddCreatedTag({tagId: tag._id, assetId}))
      }

      if (tag._id) {
        return of(dialogRemove('tagCreate'))
      }

      return empty()
    })
  )
