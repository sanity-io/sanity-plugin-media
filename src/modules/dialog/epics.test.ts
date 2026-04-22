// @vitest-environment node

import {describe, expect, it, vi} from 'vitest'
import {dialogClearOnAssetUpdateEpic, dialogTagCreateEpic, dialogTagDeleteEpic} from './index'
import {assetsActions, initialState as assetsInitialState} from '../assets'
import {tagsActions} from '../tags'
import {createEpicTestStore} from '../../__tests__/fixtures/createEpicTestStore'
import {createMockSanityClient} from '../../__tests__/fixtures/mockSanityClient'
import type {ImageAsset, Tag} from '../../types'

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

const tagWithId = (id: string): Tag => ({
  ...sampleTag,
  _id: id
})

describe('dialogClearOnAssetUpdateEpic', () => {
  it('removes the dialog when assets.updateComplete carries closeDialogId', async () => {
    const store = createEpicTestStore(dialogClearOnAssetUpdateEpic, createMockSanityClient({}), {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {
          a1: {_type: 'asset', asset: sampleAsset, picked: false, updating: true}
        }
      },
      dialog: {
        items: [{id: 'a1', type: 'assetEdit', assetId: 'a1'}]
      }
    })

    store.dispatch(assetsActions.updateComplete({asset: sampleAsset, closeDialogId: 'a1'}))

    await vi.waitFor(() => {
      expect(store.getState().dialog.items).toHaveLength(0)
    })
  })

  it('removes the dialog when tags.updateComplete carries closeDialogId', async () => {
    const store = createEpicTestStore(dialogClearOnAssetUpdateEpic, createMockSanityClient({}), {
      tags: {
        allIds: ['t1'],
        byIds: {
          t1: {_type: 'tag', tag: sampleTag, picked: false, updating: true}
        },
        creating: false,
        fetchCount: -1,
        fetching: false,
        panelVisible: true
      },
      dialog: {
        items: [{id: 't1', type: 'tagEdit', tagId: 't1'}]
      }
    })

    store.dispatch(tagsActions.updateComplete({tag: sampleTag, closeDialogId: 't1'}))

    await vi.waitFor(() => {
      expect(store.getState().dialog.items).toHaveLength(0)
    })
  })

  it('does not emit remove when closeDialogId is absent', async () => {
    const store = createEpicTestStore(dialogClearOnAssetUpdateEpic, createMockSanityClient({}), {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {
          a1: {_type: 'asset', asset: sampleAsset, picked: false, updating: true}
        }
      },
      dialog: {
        items: [{id: 'a1', type: 'assetEdit', assetId: 'a1'}]
      }
    })

    store.dispatch(assetsActions.updateComplete({asset: sampleAsset}))

    expect(store.getState().dialog.items).toHaveLength(1)
  })
})

describe('dialogTagCreateEpic', () => {
  it('dispatches inlineTagCreate when createComplete includes assetId', async () => {
    const store = createEpicTestStore(dialogTagCreateEpic, createMockSanityClient({}), {
      dialog: {
        items: [{id: 'a1', type: 'assetEdit', assetId: 'a1'}]
      }
    })

    store.dispatch(tagsActions.createComplete({assetId: 'a1', tag: sampleTag}))

    await vi.waitFor(() => {
      const item = store.getState().dialog.items[0]
      expect(item?.type).toBe('assetEdit')
      expect('lastCreatedTag' in item && item.lastCreatedTag).toEqual({
        label: 'alpha',
        value: 't1'
      })
    })
  })

  it('removes tag create dialog when createComplete has no assetId', async () => {
    const store = createEpicTestStore(dialogTagCreateEpic, createMockSanityClient({}), {
      dialog: {
        items: [{id: 'tagCreate', type: 'tagCreate'}]
      }
    })

    store.dispatch(tagsActions.createComplete({tag: sampleTag}))

    await vi.waitFor(() => {
      expect(store.getState().dialog.items).toHaveLength(0)
    })
  })
})

describe('dialogTagDeleteEpic', () => {
  it('dispatches inlineTagRemove with listener tag ids', async () => {
    const store = createEpicTestStore(dialogTagDeleteEpic, createMockSanityClient({}), {
      tags: {
        allIds: ['t9'],
        byIds: {
          t9: {_type: 'tag', tag: tagWithId('t9'), picked: false, updating: false}
        },
        creating: false,
        fetchCount: -1,
        fetching: false,
        panelVisible: true
      },
      dialog: {
        items: [{id: 'a1', type: 'assetEdit', assetId: 'a1'}]
      }
    })

    store.dispatch(tagsActions.listenerDeleteQueueComplete({tagIds: ['t9']}))

    await vi.waitFor(() => {
      expect(store.getState().dialog.items[0]).toMatchObject({
        type: 'assetEdit',
        lastRemovedTagIds: ['t9']
      })
    })
  })
})
