import produce from 'immer'

import {DocumentReducerState} from './types'

/***********
 * ACTIONS *
 ***********/

export enum DocumentActionTypes {}

/***********
 * REDUCER *
 ***********/

const INITIAL_STATE = null

export default function documentReducer(state: DocumentReducerState = INITIAL_STATE) {
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
