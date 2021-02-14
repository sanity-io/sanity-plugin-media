import {AnyAction, PayloadAction, createSlice} from '@reduxjs/toolkit'
import {ImageAsset} from '@types'
import pluralize from 'pluralize'
import {Epic, ofType} from 'redux-observable'
import {of} from 'rxjs'
import {bufferTime, filter, mergeMap} from 'rxjs/operators'
import {
  deleteComplete,
  deleteError,
  fetchError,
  tagsAddComplete,
  tagsRemoveComplete,
  updateComplete,
  updateError
} from '../assets'
import {
  createComplete as tagsCreateComplete,
  createError as tagsCreateError,
  deleteComplete as tagsDeleteComplete,
  fetchError as tagsFetchError,
  updateComplete as tagsUpdateComplete,
  updateError as tagsUpdateError
} from '../tags'
import {RootReducerState} from '../types'

type Notification = {
  asset?: ImageAsset
  status?: 'error' | 'warning' | 'success' | 'info'
  subtitle?: string
  title?: string
}

type NotificationsReducerState = {
  items: Notification[]
}

const initialState = {
  items: []
} as NotificationsReducerState

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    add(state, action: PayloadAction<Notification>) {
      const {asset, status, subtitle, title} = action.payload
      state.items.push({
        asset,
        status,
        subtitle,
        title
      })
    }
  }
})

// Epics

type MyEpic = Epic<AnyAction, AnyAction, RootReducerState>

export const notificationsAssetsDeleteCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(deleteComplete.match),
    bufferTime(1000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const deletedCount = actions.length
      return of(
        notificationsSlice.actions.add({
          status: 'success',
          title: `${deletedCount} ${pluralize('asset', deletedCount)} deleted`
        })
      )
    })
  )

export const notificationsAssetsDeleteErrorEpic: MyEpic = action$ =>
  action$.pipe(
    filter(deleteError.match),
    bufferTime(1000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const count = actions.length
      return of(
        // TODO: add error message if count === 1
        notificationsSlice.actions.add({
          status: 'error',
          title: `Unable to delete ${count} ${pluralize('asset', count)}`
        })
      )
    })
  )

export const notificationsAssetsTagsAddCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsAddComplete.match),
    mergeMap(action => {
      const count = action?.payload?.assets?.length
      return of(
        notificationsSlice.actions.add({
          status: 'success',
          title: `Tag added to ${count} ${pluralize('asset', count)}`
        })
      )
    })
  )

export const notificationsAssetsTagsRemoveCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsRemoveComplete.match),
    mergeMap(action => {
      const count = action?.payload?.assets?.length
      return of(
        notificationsSlice.actions.add({
          status: 'success',
          title: `Tag removed from ${count} ${pluralize('asset', count)}`
        })
      )
    })
  )

export const notificationsAssetsUpdateCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(updateComplete.match),
    mergeMap(() =>
      of(
        notificationsSlice.actions.add({
          status: 'success',
          title: `Asset updated`
        })
      )
    )
  )

export const notificationsGenericErrorEpic: MyEpic = action$ =>
  action$.pipe(
    ofType(
      fetchError.type,
      updateError.type,
      tagsCreateError.type,
      tagsFetchError.type,
      tagsUpdateError.type
    ),
    mergeMap(action => {
      const error = action.payload?.error
      return of(
        notificationsSlice.actions.add({
          status: 'error',
          title: `An error occured: ${error.message}`
        })
      )
    })
  )

export const notificationsTagCreateCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsCreateComplete.match),
    mergeMap(() =>
      of(
        notificationsSlice.actions.add({
          status: 'success',
          title: `Tag created`
        })
      )
    )
  )

export const notificationsTagDeleteCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsDeleteComplete.match),
    mergeMap(() =>
      of(
        notificationsSlice.actions.add({
          status: 'success',
          title: `Tag deleted`
        })
      )
    )
  )

export const notificationsTagUpdateCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsUpdateComplete.match),
    mergeMap(() =>
      of(
        notificationsSlice.actions.add({
          status: 'success',
          title: `Tag updated`
        })
      )
    )
  )

export default notificationsSlice.reducer
