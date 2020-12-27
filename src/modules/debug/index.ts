import produce from 'immer'

import {DebugActions, DebugReducerState} from './types'

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
) {
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

export const debugSetBadConnection = (badConnection: boolean) => ({
  payload: {
    badConnection
  },
  type: DebugActionTypes.SET_BAD_CONNECTION
})

/*********
 * EPICS *
 *********/
