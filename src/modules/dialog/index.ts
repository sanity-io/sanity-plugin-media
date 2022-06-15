import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AssetItem, Dialog, MyEpic, Tag} from '@types'
import pluralize from 'pluralize'
import {ofType} from 'redux-observable'
import {empty, of} from 'rxjs'
import {filter, mergeMap} from 'rxjs/operators'
import {assetsActions} from '../assets'
import {ASSETS_ACTIONS} from '../assets/actions'
import {tagsActions} from '../tags'
import {DIALOG_ACTIONS} from './actions'

type DialogReducerState = {
  items: Dialog[]
}

const initialState = {
  items: []
} as DialogReducerState

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  extraReducers: builder => {
    builder.addCase(DIALOG_ACTIONS.showTagCreate, state => {
      state.items.push({
        id: 'tagCreate',
        type: 'tagCreate'
      })
    })
    builder.addCase(DIALOG_ACTIONS.showTagEdit, (state, action) => {
      const {tagId} = action.payload
      state.items.push({
        id: tagId,
        tagId,
        type: 'tagEdit'
      })
    })
  },
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
        confirmCallbackAction: ASSETS_ACTIONS.tagsAddRequest({
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
        confirmCallbackAction: ASSETS_ACTIONS.tagsRemoveRequest({assets: assetsPicked, tag}),
        confirmText: `Yes, remove tag from ${suffix}`,
        headerTitle: 'Confirm tag removal',
        id: 'confirm',
        title: `Remove tag ${tag.name.current} from ${suffix}?`,
        tone: 'critical',
        type: 'confirm'
      })
    },
    showConfirmDeleteAssets(
      state,
      action: PayloadAction<{assets: AssetItem[]; closeDialogId?: string}>
    ) {
      const {assets, closeDialogId} = action.payload

      const suffix = `${assets.length} ${pluralize('asset', assets.length)}`

      state.items.push({
        closeDialogId,
        confirmCallbackAction: assetsActions.deleteRequest({
          assets: assets.map(assetItem => assetItem.asset)
        }),
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
    showTags(state) {
      state.items.push({
        id: 'tags',
        type: 'tags'
      })
    }
  }
})

// Epics

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
      }
      return empty()
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
    filter(tagsActions.listenerDeleteQueueComplete.match),
    mergeMap(action => {
      const {tagIds} = action?.payload

      return of(dialogSlice.actions.inlineTagRemove({tagIds}))
    })
  )

export const dialogActions = dialogSlice.actions

export default dialogSlice.reducer
