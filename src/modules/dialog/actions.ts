import {createAction} from '@reduxjs/toolkit'

export const DIALOG_ACTIONS = {
  showFolderCreate: createAction(
    'dialog/showFolderCreate',
    function prepare({folderPath}: {folderPath?: string | null} = {}) {
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
