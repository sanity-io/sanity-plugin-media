import {createAction} from '@reduxjs/toolkit'
import type {AssetItem} from '../../types'

export const DIALOG_ACTIONS = {
  showFolderCreate: createAction(
    'dialog/showFolderCreate',
    function prepare({folderPath}: {folderPath?: string | null} = {}) {
      return {
        payload: {folderPath}
      }
    }
  ),
  showFolderMove: createAction(
    'dialog/showFolderMove',
    function prepare({assets, folderPath}: {assets: AssetItem[]; folderPath?: string | null}) {
      return {
        payload: {assets, folderPath}
      }
    }
  ),
  showFolderRename: createAction(
    'dialog/showFolderRename',
    function prepare({folderPath}: {folderPath: string}) {
      return {
        payload: {folderPath}
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
