import {AnyAction, PayloadAction, createSlice} from '@reduxjs/toolkit'
import {ImageAsset} from '@types'
import pluralize from 'pluralize'
import {Epic, ofType} from 'redux-observable'
import {of} from 'rxjs'
import {bufferTime, filter, mergeMap} from 'rxjs/operators'
import {assetsActions} from '../assets'
import {tagsActions} from '../tags'
import {RootReducerState} from '../types'
import {uploadsActions} from '../uploads'

type Notification = {
  asset?: ImageAsset
  status?: 'error' | 'warning' | 'success' | 'info'
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
      const {asset, status, title} = action.payload
      state.items.push({
        asset,
        status,
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
    mergeMap(action => {
      const {assetIds} = action.payload
      const deletedCount = assetIds.length
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
    mergeMap(action => {
      const {assetIds} = action.payload
      const count = assetIds.length
      return of(
        notificationsSlice.actions.add({
          status: 'error',
          title: `Unable to delete ${count} ${pluralize(
            'asset',
            count
          )}. Please review any asset errors and try again.`
        })
      )
    })
  )

export const notificationsAssetsUploadCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(uploadsActions.checkComplete.match),
    mergeMap(action => {
      const {results} = action.payload

      const count = Object.keys(results).length
      return of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `Uploaded ${count} ${pluralize('asset', count)}`
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
    bufferTime(2000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const updatedCount = actions.length
      return of(
        notificationsSlice.actions.add({
          status: 'info',
          title: `${updatedCount} ${pluralize('asset', updatedCount)} updated`
        })
      )
    })
  )

export const notificationsGenericErrorEpic: MyEpic = action$ =>
  action$.pipe(
    ofType(
      assetsActions.fetchError.type,
      assetsActions.updateError.type,
      tagsActions.createError.type,
      tagsActions.fetchError.type,
      tagsActions.updateError.type,
      uploadsActions.uploadError.type
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
    mergeMap(() => of(notificationsSlice.actions.add({status: 'info', title: `Tag created`})))
  )

export const notificationsTagDeleteCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsActions.deleteComplete.match),
    mergeMap(() => of(notificationsSlice.actions.add({status: 'info', title: `Tag deleted`})))
  )

export const notificationsTagUpdateCompleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsActions.updateComplete.match),
    mergeMap(() => of(notificationsSlice.actions.add({status: 'info', title: `Tag updated`})))
  )

export const notificationsActions = notificationsSlice.actions

export default notificationsSlice.reducer
