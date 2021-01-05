import {DebugActionTypes} from './index'

// Reducer

export type DebugReducerState = {
  badConnection: boolean
  enabled: boolean
}

// Actions

export type DebugSetBadConnectionAction = {
  payload: {
    badConnection: boolean
  }
  type: DebugActionTypes.SET_BAD_CONNECTION
}

export type DebugToggleEnabledAction = {
  type: DebugActionTypes.TOGGLE_ENABLED
}

// All actions

export type DebugActions = DebugSetBadConnectionAction | DebugToggleEnabledAction
