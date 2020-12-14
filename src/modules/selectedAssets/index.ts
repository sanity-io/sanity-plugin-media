import produce from 'immer'

import {SelectedAssetsReducerState} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DocumentActionTypes {}

/***********
 * REDUCER *
 ***********/

const INITIAL_STATE = null

export default function selectedAssetsReducer(state: SelectedAssetsReducerState = INITIAL_STATE) {
  return produce(state, draft => {
    /*
    switch (action.type) {
      default:
        break
    }
    */
    return draft
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

/*********
 * EPICS *
 *********/
