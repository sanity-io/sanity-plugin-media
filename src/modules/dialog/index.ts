import {PayloadAction, createSlice} from '@reduxjs/toolkit'
import {Asset, AssetItem, Dialog, Tag} from '@types'
import pluralize from 'pluralize'
import {AnyAction} from 'redux'
import {Epic, ofType} from 'redux-observable'
import {empty, of} from 'rxjs'
import {filter, mergeMap} from 'rxjs/operators'

import {assetsActions} from '../assets'
import {tagsActions} from '../tags'

import {RootReducerState} from '../types'

type DialogReducerState = {
  items: Dialog[]
}

const initialState = {
  items: []
} as DialogReducerState

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    // Clear all dialogs
    clear(state) {
      state.items = []
    },
    // Add newly created inline tag to assetEdit dialog
    inlineTagCreate(state, action: PayloadAction<{assetId: string; tag: Tag}>) {
      const {assetId, tag} = action.payload

      state.items.forEach(item => {
        if (item.type === 'assetEdit' && item.assetId === assetId) {
          item.lastCreatedTag = {
            label: tag.name.current,
            value: tag._id
          }
        }
      })
    },
    // Remove inline tags from assetEdit dialog
    inlineTagRemove(state, action: PayloadAction<{tagIds: string[]}>) {
      const {tagIds} = action.payload

      state.items.forEach(item => {
        if (item.type === 'assetEdit') {
          item.lastRemovedTagIds = tagIds
        }
      })
    },
    // Remove dialog by id
    remove(state, action: PayloadAction<{id: string}>) {
      const id = action.payload?.id
      state.items = state.items.filter(item => item.id !== id)
    },
    showConfirmAssetsTagAdd(
      state,
      action: PayloadAction<{
        assetsPicked: AssetItem[]
        closeDialogId?: string
        tag: Tag
      }>
    ) {
      const {assetsPicked, closeDialogId, tag} = action.payload

      const suffix = `${assetsPicked.length} ${pluralize('asset', assetsPicked.length)}`

      state.items.push({
        closeDialogId,
        confirmCallbackAction: assetsActions.tagsAddRequest({
          assets: assetsPicked,
          tag
        }),
        confirmText: `Yes, add tag to ${suffix}`,
        title: `Add tag ${tag.name.current} to ${suffix}?`,
        id: 'confirm',
        headerTitle: 'Confirm tag addition',
        tone: 'primary',
        type: 'confirm'
      })
    },
    showConfirmAssetsTagRemove(
      state,
      action: PayloadAction<{
        assetsPicked: AssetItem[]
        closeDialogId?: string
        tag: Tag
      }>
    ) {
      const {assetsPicked, closeDialogId, tag} = action.payload

      const suffix = `${assetsPicked.length} ${pluralize('asset', assetsPicked.length)}`

      state.items.push({
        closeDialogId,
        confirmCallbackAction: assetsActions.tagsRemoveRequest({assets: assetsPicked, tag}),
        confirmText: `Yes, remove tag from ${suffix}`,
        headerTitle: 'Confirm tag removal',
        id: 'confirm',
        title: `Remove tag ${tag.name.current} from ${suffix}?`,
        tone: 'critical',
        type: 'confirm'
      })
    },
    showConfirmDeleteAsset(state, action: PayloadAction<{asset: Asset; closeDialogId?: string}>) {
      const {asset, closeDialogId} = action.payload

      const suffix = 'asset'

      state.items.push({
        closeDialogId,
        confirmCallbackAction: assetsActions.deleteRequest({asset}),
        confirmText: `Yes, delete ${suffix}`,
        description: 'This operation cannot be reversed. Are you sure you want to continue?',
        title: `Permanently delete ${suffix}?`,
        id: 'confirm',
        headerTitle: 'Confirm deletion',
        tone: 'critical',
        type: 'confirm'
      })
    },
    showConfirmDeleteAssetsPicked(
      state,
      action: PayloadAction<{assetsPicked: AssetItem[]; closeDialogId?: string}>
    ) {
      const {assetsPicked, closeDialogId} = action.payload

      const suffix = `${assetsPicked.length} ${pluralize('asset', assetsPicked.length)}`

      state.items.push({
        closeDialogId,
        confirmCallbackAction: assetsActions.deletePicked(),
        confirmText: `Yes, delete ${suffix}`,
        description: 'This operation cannot be reversed. Are you sure you want to continue?',
        title: `Permanently delete ${suffix}?`,
        id: 'confirm',
        headerTitle: 'Confirm deletion',
        tone: 'critical',
        type: 'confirm'
      })
    },
    showConfirmDeleteTag(state, action: PayloadAction<{closeDialogId?: string; tag: Tag}>) {
      const {closeDialogId, tag} = action.payload

      const suffix = 'tag'

      state.items.push({
        closeDialogId,
        confirmCallbackAction: tagsActions.deleteRequest({tag}),
        confirmText: `Yes, delete ${suffix}`,
        description: 'This operation cannot be reversed. Are you sure you want to continue?',
        title: `Permanently delete ${suffix}?`,
        id: 'confirm',
        headerTitle: 'Confirm deletion',
        tone: 'critical',
        type: 'confirm'
      })
    },
    showAssetEdit(state, action: PayloadAction<{assetId: string}>) {
      const {assetId} = action.payload
      state.items.push({
        assetId,
        id: assetId,
        type: 'assetEdit'
      })
    },
    showSearchFacets(state) {
      state.items.push({
        id: 'searchFacets',
        type: 'searchFacets'
      })
    },
    showTagCreate(state) {
      state.items.push({
        id: 'tagCreate',
        type: 'tagCreate'
      })
    },
    showTagEdit(state, action: PayloadAction<{tagId: string}>) {
      const {tagId} = action.payload
      state.items.push({
        id: tagId,
        tagId,
        type: 'tagEdit'
      })
    },
    showTags(state) {
      state.items.push({
        id: 'tags',
        type: 'tags'
      })
    }
  }
})

// Epics

type MyEpic = Epic<AnyAction, AnyAction, RootReducerState>

export const dialogClearOnAssetUpdateEpic: MyEpic = action$ =>
  action$.pipe(
    ofType(
      assetsActions.deleteComplete.type,
      assetsActions.updateComplete.type,
      tagsActions.deleteComplete.type,
      tagsActions.updateComplete.type
    ),
    filter(action => !!action?.payload?.closeDialogId),
    mergeMap(action => {
      const dialogId = action?.payload?.closeDialogId
      if (dialogId) {
        return of(dialogSlice.actions.remove({id: dialogId}))
      } else {
        return empty()
      }
    })
  )

export const dialogTagCreateEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsActions.createComplete.match),
    mergeMap(action => {
      const {assetId, tag} = action?.payload

      if (assetId) {
        return of(dialogSlice.actions.inlineTagCreate({tag, assetId}))
      }

      if (tag._id) {
        return of(dialogSlice.actions.remove({id: 'tagCreate'}))
      }

      return empty()
    })
  )

export const dialogTagDeleteEpic: MyEpic = action$ =>
  action$.pipe(
    filter(tagsActions.listenerDeleteComplete.match),
    mergeMap(action => {
      const {tagIds} = action?.payload

      return of(dialogSlice.actions.inlineTagRemove({tagIds}))
    })
  )

export const dialogActions = dialogSlice.actions

export default dialogSlice.reducer
