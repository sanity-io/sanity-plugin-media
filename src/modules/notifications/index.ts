import {AnyAction, PayloadAction, createSlice} from '@reduxjs/toolkit'
import {ImageAsset} from '@types'
import pluralize from 'pluralize'
import {Epic, ofType} from 'redux-observable'
import {of} from 'rxjs'
import {bufferTime, filter, mergeMap} from 'rxjs/operators'
import {assetsActions} from '../assets'
import {tagsActions} from '../tags'
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
    filter(assetsActions.deleteComplete.match),
    bufferTime(1000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const deletedCount = actions.length
      return of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `${deletedCount} ${pluralize('asset', deletedCount)} deleted`
        })
      )
    })
  )

export const notificationsAssetsDeleteErrorEpic: MyEpic = action$ =>
  action$.pipe(
    filter(assetsActions.deleteError.match),
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
    filter(assetsActions.tagsAddComplete.match),
    mergeMap(action => {
      const count = action?.payload?.assets?.length
      return of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `Tag added to ${count} ${pluralize('asset', count)}`
        })
      )
    })
  )

export const notificationsAssetsTagsRemoveCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(assetsActions.tagsRemoveComplete.match),
    mergeMap(action => {
      const count = action?.payload?.assets?.length
      return of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `Tag removed from ${count} ${pluralize('asset', count)}`
        })
      )
    })
  )

export const notificationsAssetsUpdateCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(assetsActions.updateComplete.match),
    mergeMap(() =>
      of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `Asset updated`
        })
      )
    )
  )

export const notificationsGenericErrorEpic: MyEpic = action$ =>
  action$.pipe(
    ofType(
      assetsActions.fetchError.type,
      assetsActions.updateError.type,
      tagsActions.createError.type,
      tagsActions.fetchError.type,
      tagsActions.updateError.type
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
    filter(tagsActions.createComplete.match),
    mergeMap(() =>
      of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `Tag created`
        })
      )
    )
  )

export const notificationsTagDeleteCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsActions.deleteComplete.match),
    mergeMap(() =>
      of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `Tag deleted`
        })
      )
    )
  )

export const notificationsTagUpdateCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsActions.updateComplete.match),
    mergeMap(() =>
      of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `Tag updated`
        })
      )
    )
  )

export default notificationsSlice.reducer
