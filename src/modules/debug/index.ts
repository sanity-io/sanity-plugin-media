import produce from 'immer'

import {DebugActions, DebugReducerState, DebugSetBadConnectionAction} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DebugActionTypes {
  SET_BAD_CONNECTION = 'DEBUG_SET_BAD_CONNECTION'
}

/***********
 * REDUCER *
 ***********/

const initialState: DebugReducerState = {
  badConnection: false
}

export default function debugReducer(
  state: DebugReducerState = initialState,
  action: DebugActions
): DebugReducerState {
  return produce(state, draft => {
    switch (action.type) {
      case DebugActionTypes.SET_BAD_CONNECTION:
        draft.badConnection = action.payload?.badConnection
        break
      default:
        break
    }
    return draft
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

export const debugSetBadConnection = (badConnection: boolean): DebugSetBadConnectionAction => ({
  payload: {
    badConnection
  },
  type: DebugActionTypes.SET_BAD_CONNECTION
})

/*********
 * EPICS *
 *********/
