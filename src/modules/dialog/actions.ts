import {createAction} from '@reduxjs/toolkit'

export const DIALOG_ACTIONS = {
  showTagCreate: createAction('dialog/showTagCreate'),
  showMassEdit: createAction('dialog/showMassEdit'),
  showTagEdit: createAction('dialog/showTagEdit', function prepare({tagId}: {tagId: string}) {
    return {
      payload: {tagId}
    }
  })
}
