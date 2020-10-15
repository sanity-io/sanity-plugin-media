import produce from 'immer'

import {BrowserView} from '../../types'
import {BrowserActions, BrowserReducerState} from './types'

/***********
 * ACTIONS *
 ***********/

export enum BrowserActionTypes {
  SET_VIEW = 'BROWSER_SET_VIEW'
}

/***********
 * REDUCER *
 ***********/

const INITIAL_STATE: BrowserReducerState = {
  view: 'grid'
}

export default function dialogReducer(
  state: BrowserReducerState = INITIAL_STATE,
  action: BrowserActions
) {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case BrowserActionTypes.SET_VIEW:
        draft.view = action.payload?.view
        break
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

/**
 * Set view mode
 */

export const browserSetView = (view: BrowserView) => ({
  payload: {
    view
  },
  type: BrowserActionTypes.SET_VIEW
})
