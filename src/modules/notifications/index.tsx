import {ReactNode} from 'react'
import pluralize from 'pluralize'
import produce from 'immer'
import {Observable, of} from 'rxjs'
import {bufferTime, filter, mergeMap} from 'rxjs/operators'
import {AssetsActionTypes} from '../assets'
import {NotificationsReducerState, NotificationsActions, NotificationsAddAction} from './types'
import {isOfType} from 'typesafe-actions'
import {AssetsActions} from '../assets/types'
import {TagsActionTypes} from '../tags'
import {TagsActions} from '../tags/types'

/***********
 * ACTIONS *
 ***********/

export enum NotificationsActionTypes {
  ADD = 'NOTIFICATIONS_ADD'
}

/***********
 * REDUCER *
 ***********/

const INITIAL_STATE = {
  items: []
}

export default function notificationsReducer(
  state: NotificationsReducerState = INITIAL_STATE,
  action: NotificationsActions
): NotificationsReducerState {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case NotificationsActionTypes.ADD: {
        const asset = action.payload?.asset
        const status = action.payload?.status
        const subtitle = action.payload?.subtitle
        const timeout = action.payload?.timeout
        const title = action.payload?.title

        draft.items.push({
          asset,
          status,
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

// Add error notification
export const notificationsAddError = ({
  subtitle,
  title
}: {
  subtitle?: string
  title: ReactNode
}): NotificationsAddAction => ({
  payload: {
    subtitle,
    status: 'error',
    timeout: 8000,
    title
  },
  type: NotificationsActionTypes.ADD
})

// Add success notification
export const notificationsAddSuccess = ({
  subtitle,
  title
}: {
  subtitle?: string
  title: ReactNode
}): NotificationsAddAction => ({
  payload: {
    subtitle,
    status: 'success',
    timeout: 4000,
    title
  },
  type: NotificationsActionTypes.ADD
})

/*********
 * EPICS *
 *********/

/**
 * Listen for successful asset deletions:
 * - Display success notification
 * - Buffer responses over 1000ms
 */
export const notificationsAddSuccessEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.DELETE_COMPLETE)),
    bufferTime(1000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const deletedCount = actions.length
      return of(
        notificationsAddSuccess({
          title: `${deletedCount} ${pluralize('asset', deletedCount)} deleted`
        })
      )
    })
  )

/**
 * Listen for asset delete errors
 * - Display error notification
 * - Buffer responses over 1000ms
 */
export const notificationsAddDeleteErrorsEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.DELETE_ERROR)),
    bufferTime(1000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const errorCount = actions.length
      return of(
        notificationsAddError({
          title: `Unable to delete ${errorCount} ${pluralize('asset', errorCount)}`
        })
      )
    })
  )

/**
 * Listen for successful asset updates:
 * - Display success notification
 */

export const notificationsAddUpdateEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.UPDATE_COMPLETE)),
    mergeMap(() =>
      of(
        notificationsAddSuccess({
          title: `Image updated`
        })
      )
    )
  )

/**
 * Listen for asset update errors:
 * - Display error notification
 */
export const notificationsAddGenericErrorEpic = (
  action$: Observable<AssetsActions | TagsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(
      isOfType([
        AssetsActionTypes.FETCH_ERROR, //
        AssetsActionTypes.UPDATE_ERROR,
        TagsActionTypes.CREATE_ERROR
      ])
    ),
    mergeMap(action => {
      const error = action.payload?.error
      return of(
        notificationsAddError({
          title: `An error occured: ${error.toString()}`
        })
      )
    })
  )
