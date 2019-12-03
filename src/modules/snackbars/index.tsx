import React, {ReactNode} from 'react'
import idx from 'idx'
import pluralize from 'pluralize'
import produce from 'immer'
import {ofType} from 'redux-observable'
import {of} from 'rxjs'
import {bufferTime, filter, mergeMap} from 'rxjs/operators'
import {AssetsActionTypes} from '../assets'
import {SnackbarsReducerState, SnackbarActions} from './types'

/***********
 * ACTIONS *
 ***********/

export enum SnackbarsActionTypes {
  ADD = 'SNACKBARS_ADD'
}

/***********
 * REDUCER *
 ***********/

const INITIAL_STATE = {
  items: []
}

export default function snackbarsReducer(
  state: SnackbarsReducerState = INITIAL_STATE,
  action: SnackbarActions
) {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case SnackbarsActionTypes.ADD: {
        const asset = action.payload?.asset
        const kind = action.payload?.kind
        const subtitle = action.payload?.subtitle
        const timeout = action.payload?.timeout
        const title = action.payload?.title

        draft.items.push({
          asset,
          id: String(new Date().getTime() + Math.floor(Math.random() * 10000)),
          kind,
          subtitle,
          timeout,
          title
        })
        break
      }
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// Add error snackbar
export const snackbarsAddError = ({subtitle, title}: {subtitle?: string; title: ReactNode}) => ({
  payload: {
    kind: 'error',
    subtitle,
    timeout: 8000,
    title
  },
  type: SnackbarsActionTypes.ADD
})

// Add success snackbar
export const snackbarsAddSuccess = ({subtitle, title}: {subtitle?: string; title: ReactNode}) => ({
  payload: {
    kind: 'success',
    subtitle,
    timeout: 4000,
    title
  },
  type: SnackbarsActionTypes.ADD
})

/*********
 * EPICS *
 *********/

/**
 * Listen for successful asset deletes errors:
 * - Display success snackbar
 * - Buffer responses over 1000ms
 */

export const snackbarsAddSuccessEpic = (action$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.DELETE_COMPLETE),
    bufferTime(1000),
    filter((actions: any) => actions.length > 0),
    mergeMap((actions: any) => {
      const deletedCount = actions.length
      return of(
        snackbarsAddSuccess({
          title: (
            <>
              {deletedCount} {pluralize('image', deletedCount)} deleted
            </>
          )
        })
      )
    })
  )

/**
 * Listen for asset delete errors where `handleTarget == 'snackbar'`:
 * - Display error snackbar
 * - Buffer responses over 1000ms
 */
export const snackbarsAddDeleteErrorsEpic = (action$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.DELETE_ERROR),
    filter((action: any) => {
      const handleTarget = idx(action, _ => _.payload.handleTarget)
      return handleTarget === 'snackbar'
    }),
    bufferTime(1000),
    filter((actions: any) => actions.length > 0),
    mergeMap((actions: any) => {
      const errorCount = actions.length
      return of(
        snackbarsAddError({
          subtitle: 'Please view errors for more information',
          title: (
            <strong>
              Unable to delete {errorCount} {pluralize('image', errorCount)}
            </strong>
          )
        })
      )
    })
  )

/**
 * Listen for asset fetch errors:
 * - Display error snackbar
 */
export const snackbarsAddFetchErrorEpic = (action$: any) =>
  action$.pipe(
    ofType(AssetsActionTypes.FETCH_ERROR),
    mergeMap((action: any) => {
      const error = action.payload?.error
      return of(
        snackbarsAddError({
          title: <strong>An error occured: {error.toString()}</strong>
        })
      )
    })
  )
