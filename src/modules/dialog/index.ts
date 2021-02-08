import produce from 'immer'
import {empty, Observable, of} from 'rxjs'
import {filter, mergeMap} from 'rxjs/operators'
import {isOfType} from 'typesafe-actions'

import {AssetsActionTypes} from '../assets'
import {AssetsActions} from '../assets/types'
import {TagsActionTypes} from '../tags'
import {TagsActions} from '../tags/types'
import {
  DialogAddCreatedTagAction,
  DialogActions,
  DialogClearAction,
  DialogReducerState,
  DialogRemoveAction,
  DialogShowDeleteConfirmAction,
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
  REMOVE = 'DIALOG_REMOVE',
  SHOW_DELETE_CONFIRM = 'DIALOG_SHOW_DELETE_CONFIRM',
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
          if (item.type === 'details' && item.assetId === action.payload.assetId) {
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
          type: 'details'
        })
        break
      }
      case DialogActionTypes.SHOW_DELETE_CONFIRM: {
        const {closeDialogId, documentId, documentType} = action.payload
        draft.items.push({
          closeDialogId,
          documentId,
          documentType,
          id: 'deleteConfirm',
          type: 'deleteConfirm'
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
          id: tagId,
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

/**
 * Display asset delete confirmation
 */
export const dialogShowDeleteConfirm = ({
  closeDialogId,
  documentId,
  documentType
}: {
  closeDialogId?: string
  documentId?: string
  documentType: 'asset' | 'tag'
}): DialogShowDeleteConfirmAction => ({
  payload: {
    closeDialogId,
    documentId,
    documentType
  },
  type: DialogActionTypes.SHOW_DELETE_CONFIRM
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
