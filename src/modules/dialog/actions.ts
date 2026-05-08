import {createAction} from '@reduxjs/toolkit'
import type {AssetItem} from '../../types'

export const DIALOG_ACTIONS = {
  showFolderCreate: createAction(
    'dialog/showFolderCreate',
    function prepare({parentFolderId}: {parentFolderId?: string | null} = {}) {
      return {
        payload: {parentFolderId}
      }
    }
  ),
  showFolderMove: createAction(
    'dialog/showFolderMove',
    function prepare({assets, folderId}: {assets: AssetItem[]; folderId?: string | null}) {
      return {
        payload: {assets, folderId}
      }
    }
  ),
  showFolderRename: createAction(
    'dialog/showFolderRename',
    function prepare({folderId}: {folderId: string}) {
      return {
        payload: {folderId}
      }
    }
  ),
  showTagCreate: createAction('dialog/showTagCreate'),
  showTagEdit: createAction('dialog/showTagEdit', function prepare({tagId}: {tagId: string}) {
    return {
      payload: {tagId}
    }
  })
}
