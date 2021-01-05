import produce from 'immer'

import {SelectedAssetsReducerState} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DocumentActionTypes {}

/***********
 * REDUCER *
 ***********/

const initialState: SelectedAssetsReducerState = []

export default function selectedAssetsReducer(
  state: SelectedAssetsReducerState = initialState
): SelectedAssetsReducerState {
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
