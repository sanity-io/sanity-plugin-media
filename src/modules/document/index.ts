import produce from 'immer'

import {DocumentReducerState} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DocumentActionTypes {}

/***********
 * REDUCER *
 ***********/

const initialState: DocumentReducerState = null

export default function documentReducer(
  state: DocumentReducerState = initialState
): DocumentReducerState {
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
