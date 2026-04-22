// @vitest-environment node

import {describe, expect, it} from 'vitest'
import {DIALOG_ACTIONS} from './actions'
import dialogReducer, {dialogActions} from './index'
import {assetsActions} from '../assets'
import {ASSETS_ACTIONS} from '../assets/actions'
import {tagsActions} from '../tags'
import type {AssetItem, ImageAsset, Tag} from '../../types'
import {createTestRootState} from '../../__tests__/fixtures/rootState'

const sampleAsset = {
  _id: 'a1',
  _type: 'sanity.imageAsset',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r1',
  originalFilename: 'x.png',
  size: 1,
  mimeType: 'image/png',
  url: 'https://example.com/x.png'
} as ImageAsset

const sampleTag: Tag = {
  _id: 't1',
  _type: 'media.tag',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'tr',
  name: {_type: 'slug', current: 'alpha'}
}

const assetItem = (asset: ImageAsset = sampleAsset): AssetItem => ({
  _type: 'asset',
  asset,
  picked: false,
  updating: false
})

function dialogState() {
  return createTestRootState().dialog
}

describe('dialog slice reducers', () => {
  it('clear removes all items', () => {
    let state = dialogReducer(
      {...dialogState(), items: [{id: 'x', type: 'tags'}]},
      dialogActions.clear()
    )
    expect(state.items).toEqual([])
  })

  it('remove filters out the dialog with the given id', () => {
    let state = dialogReducer(
      {
        ...dialogState(),
        items: [
          {id: 'a', type: 'tags'},
          {id: 'b', type: 'searchFacets'}
        ]
      },
      dialogActions.remove({id: 'a'})
    )
    expect(state.items).toEqual([{id: 'b', type: 'searchFacets'}])
  })

  it('showAssetEdit appends an asset edit dialog', () => {
    let state = dialogReducer(dialogState(), dialogActions.showAssetEdit({assetId: 'a1'}))
    expect(state.items).toEqual([{assetId: 'a1', id: 'a1', type: 'assetEdit'}])
  })

  it('showSearchFacets and showTags append the expected dialogs', () => {
    let state = dialogReducer(dialogState(), dialogActions.showSearchFacets())
    state = dialogReducer(state, dialogActions.showTags())
    expect(state.items).toEqual([
      {id: 'searchFacets', type: 'searchFacets'},
      {id: 'tags', type: 'tags'}
    ])
  })

  it('inlineTagCreate sets lastCreatedTag on matching assetEdit items', () => {
    let state = dialogReducer(
      {
        ...dialogState(),
        items: [
          {id: 'a1', type: 'assetEdit', assetId: 'a1'},
          {id: 'a2', type: 'assetEdit', assetId: 'a2'}
        ]
      },
      dialogActions.inlineTagCreate({assetId: 'a1', tag: sampleTag})
    )
    const a1 = state.items.find(i => i.type === 'assetEdit' && i.assetId === 'a1')
    const a2 = state.items.find(i => i.type === 'assetEdit' && i.assetId === 'a2')
    expect(a1 && 'lastCreatedTag' in a1 && a1.lastCreatedTag).toEqual({
      label: 'alpha',
      value: 't1'
    })
    expect(a2).toBeDefined()
    expect(Object.prototype.hasOwnProperty.call(a2, 'lastCreatedTag')).toBe(false)
  })

  it('inlineTagRemove sets lastRemovedTagIds on all assetEdit items', () => {
    let state = dialogReducer(
      {
        ...dialogState(),
        items: [
          {id: 'a1', type: 'assetEdit', assetId: 'a1'},
          {id: 'tags', type: 'tags'}
        ]
      },
      dialogActions.inlineTagRemove({tagIds: ['x', 'y']})
    )
    const edit = state.items.find(i => i.type === 'assetEdit')
    expect(edit && 'lastRemovedTagIds' in edit && edit.lastRemovedTagIds).toEqual(['x', 'y'])
    const tagsPanel = state.items.find(i => i.type === 'tags')
    expect(tagsPanel && 'lastRemovedTagIds' in tagsPanel).toBeFalsy()
  })

  it('showConfirmDeleteAssets pushes a confirm dialog wired to assets deleteRequest', () => {
    const item = assetItem()
    let state = dialogReducer(
      dialogState(),
      dialogActions.showConfirmDeleteAssets({assets: [item], closeDialogId: 'a1'})
    )
    const confirm = state.items[0]
    expect(confirm?.type).toBe('confirm')
    expect(confirm && 'title' in confirm && confirm.title).toBe('Permanently delete 1 asset?')
    const cb = confirm && 'confirmCallbackAction' in confirm ? confirm.confirmCallbackAction : null
    expect(cb).toEqual(assetsActions.deleteRequest({assets: [sampleAsset]}))
  })

  it('showConfirmDeleteTag pushes a confirm dialog wired to tags deleteRequest', () => {
    let state = dialogReducer(
      dialogState(),
      dialogActions.showConfirmDeleteTag({closeDialogId: 't1', tag: sampleTag})
    )
    const confirm = state.items[0]
    expect(confirm?.type).toBe('confirm')
    expect(confirm && 'title' in confirm && confirm.title).toMatch(/permanently delete/i)
    const cb = confirm && 'confirmCallbackAction' in confirm ? confirm.confirmCallbackAction : null
    expect(cb).toEqual(tagsActions.deleteRequest({tag: sampleTag}))
  })

  it('showConfirmAssetsTagAdd uses plural copy for multiple assets', () => {
    const a2 = {...sampleAsset, _id: 'a2', originalFilename: 'y.png'} as ImageAsset
    let state = dialogReducer(
      dialogState(),
      dialogActions.showConfirmAssetsTagAdd({
        assetsPicked: [assetItem(), assetItem(a2)],
        tag: sampleTag
      })
    )
    const confirm = state.items[0]
    expect(confirm && 'title' in confirm && confirm.title).toContain('2 assets')
    const cb = confirm && 'confirmCallbackAction' in confirm ? confirm.confirmCallbackAction : null
    expect(cb).toEqual(
      ASSETS_ACTIONS.tagsAddRequest({assets: [assetItem(), assetItem(a2)], tag: sampleTag})
    )
  })

  it('showConfirmAssetsTagRemove pushes removal confirm with tagsRemoveRequest', () => {
    let state = dialogReducer(
      dialogState(),
      dialogActions.showConfirmAssetsTagRemove({
        assetsPicked: [assetItem()],
        tag: sampleTag
      })
    )
    const confirm = state.items[0]
    expect(confirm && 'tone' in confirm && confirm.tone).toBe('critical')
    const cb = confirm && 'confirmCallbackAction' in confirm ? confirm.confirmCallbackAction : null
    expect(cb).toEqual(ASSETS_ACTIONS.tagsRemoveRequest({assets: [assetItem()], tag: sampleTag}))
  })

  it('DIALOG_ACTIONS.showTagCreate appends tag create dialog', () => {
    let state = dialogReducer(dialogState(), DIALOG_ACTIONS.showTagCreate())
    expect(state.items).toEqual([{id: 'tagCreate', type: 'tagCreate'}])
  })

  it('DIALOG_ACTIONS.showTagEdit appends tag edit dialog with tag id', () => {
    let state = dialogReducer(dialogState(), DIALOG_ACTIONS.showTagEdit({tagId: 't9'}))
    expect(state.items).toEqual([{id: 't9', tagId: 't9', type: 'tagEdit'}])
  })
})