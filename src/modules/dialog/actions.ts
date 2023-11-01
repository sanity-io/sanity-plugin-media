import {createAction} from '@reduxjs/toolkit'

export const DIALOG_ACTIONS = {
  showTagCreate: createAction('dialog/showTagCreate'),
  showSeasonCreate: createAction('dialog/showSeasonCreate'),
  showCollaborationCreate: createAction('dialog/showCollaborationCreate'),
  showMassEdit: createAction('dialog/showMassEdit'),
  showTagEdit: createAction('dialog/showTagEdit', function prepare({tagId}: {tagId: string}) {
    return {
      payload: {tagId}
    }
  }),
  showCollaborationEdit: createAction(
    'dialog/showCollaborationEdit',
    function prepare({collaborationId}: {collaborationId: string}) {
      return {
        payload: {collaborationId}
      }
    }
  ),
  showSeasonEdit: createAction(
    'dialog/showSeasonEdit',
    function prepare({seasonId}: {seasonId: string}) {
      return {
        payload: {seasonId}
      }
    }
  )
}
