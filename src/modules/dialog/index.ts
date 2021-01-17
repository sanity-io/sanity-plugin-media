import produce from 'immer'
import {empty, Observable, of} from 'rxjs'
import {filter, mergeMap} from 'rxjs/operators'
import {isOfType} from 'typesafe-actions'

import {AssetsActionTypes} from '../assets'
import {AssetsActions} from '../assets/types'
import {TagsActionTypes} from '../tags'
import {TagsActions} from '../tags/types'
import {
  DialogActions,
  DialogAddCreatedTagAction,
  DialogClearAction,
  DialogReducerState,
  DialogRemoveAction,
  DialogShowDeleteConfirmAction,
  DialogShowDetailsAction,
  DialogShowSearchFacetsAction
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
  SHOW_SEARCH_FACETS = 'DIALOG_SHOW_SEARCH_FACETS'
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
        const {assetId, options} = action.payload
        draft.items.push({
          assetId,
          closeDialogId: options?.closeDialogId,
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
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

/**
 * Add created tag to edit dialog
 */

export const dialogAddCreatedTag = (tagId: string, assetId: string): DialogAddCreatedTagAction => ({
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

export const dialogShowDeleteConfirm = (
  assetId?: string,
  options?: {
    closeDialogId?: string
  }
): DialogShowDeleteConfirmAction => ({
  payload: {
    assetId,
    options
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
    filter(isOfType([AssetsActionTypes.DELETE_COMPLETE, AssetsActionTypes.UPDATE_COMPLETE])),
    filter(action => !!action?.payload?.options?.closeDialogId),
    mergeMap(action => {
      const dialogId = action?.payload?.options?.closeDialogId
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
      const assetId = action?.payload?.options?.assetId

      if (assetId) {
        return of(dialogAddCreatedTag(action.payload.tag._id, assetId))
      } else {
        return empty()
      }
    })
  )
