import produce from 'immer'

import {
  DebugActions,
  DebugReducerState,
  DebugSetBadConnectionAction,
  DebugToggleEnabledAction
} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DebugActionTypes {
  SET_BAD_CONNECTION = 'DEBUG_SET_BAD_CONNECTION',
  TOGGLE_ENABLED = 'DEBUG_TOGGLE_ENABLED'
}

/***********
 * REDUCER *
 ***********/

const initialState: DebugReducerState = {
  badConnection: false,
  enabled: false
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
      case DebugActionTypes.TOGGLE_ENABLED:
        draft.enabled = !draft.enabled
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

export const debugToggleEnabled = (): DebugToggleEnabledAction => ({
  type: DebugActionTypes.TOGGLE_ENABLED
})

/*********
 * EPICS *
 *********/
