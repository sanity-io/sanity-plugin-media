import {BrowserView} from '../../types'
import {BrowserActionTypes} from './index'

// Reducer

export type BrowserReducerState = {
  view: BrowserView
}

// Actions

export type BrowserSetViewAction = {
  payload: {
    view: BrowserView
  }
  type: BrowserActionTypes.SET_VIEW
}

// All actions

export type BrowserActions = BrowserSetViewAction
