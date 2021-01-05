import {DebugActionTypes} from './index'

// Reducer

export type DebugReducerState = {
  badConnection: boolean
}

// Actions

export type DebugSetBadConnectionAction = {
  payload: {
    badConnection: boolean
  }
  type: DebugActionTypes.SET_BAD_CONNECTION
}

// All actions

export type DebugActions = DebugSetBadConnectionAction
