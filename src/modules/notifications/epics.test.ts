// @vitest-environment node

import {describe, expect, it, vi} from 'vitest'
import {
  notificationsAssetsDeleteCompleteEpic,
  notificationsAssetsDeleteErrorEpic,
  notificationsAssetsTagsAddCompleteEpic,
  notificationsAssetsTagsRemoveCompleteEpic,
  notificationsAssetsUpdateCompleteEpic,
  notificationsAssetsUploadCompleteEpic,
  notificationsGenericErrorEpic,
  notificationsTagCreateCompleteEpic,
  notificationsTagDeleteCompleteEpic,
  notificationsTagUpdateCompleteEpic
} from './index'
import {assetsActions, initialState as assetsInitialState} from '../assets'
import {ASSETS_ACTIONS} from '../assets/actions'
import {tagsActions} from '../tags'
import {uploadsActions} from '../uploads'
import {createEpicTestStore} from '../../__tests__/fixtures/createEpicTestStore'
import {createMockSanityClient} from '../../__tests__/fixtures/mockSanityClient'
import type {AssetItem, AssetType, ImageAsset, Tag} from '../../types'

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

const sampleAsset2 = {
  ...sampleAsset,
  _id: 'a2'
} as ImageAsset

const sampleTag: Tag = {
  _id: 't1',
  _type: 'media.tag',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'tr',
  name: {_type: 'slug', current: 'alpha'}
}

const assetItem = (asset: ImageAsset): AssetItem => ({
  _type: 'asset',
  asset,
  picked: false,
  updating: false
})

function assetsWithRows(rows: Record<string, AssetItem>) {
  return {
    ...assetsInitialState,
    assetTypes: ['image'] as AssetType[],
    allIds: Object.keys(rows),
    byIds: rows
  }
}

describe('notificationsAssetsDeleteCompleteEpic', () => {
  it('adds info notification with pluralized asset count', async () => {
    const store = createEpicTestStore(
      notificationsAssetsDeleteCompleteEpic,
      createMockSanityClient({}),
      {}
    )
    store.dispatch(assetsActions.deleteComplete({assetIds: ['x', 'y']}))
    await vi.waitFor(() => {
      expect(store.getState().notifications.items).toEqual([
        {asset: undefined, status: 'info', title: '2 assets deleted'}
      ])
    })
  })
})

describe('notificationsAssetsDeleteErrorEpic', () => {
  it('adds error notification with count', async () => {
    const store = createEpicTestStore(
      notificationsAssetsDeleteErrorEpic,
      createMockSanityClient({}),
      {
        assets: assetsWithRows({
          a1: {...assetItem(sampleAsset), updating: true}
        })
      }
    )
    store.dispatch(assetsActions.deleteError({assetIds: ['a1'], error: {} as any}))
    await vi.waitFor(() => {
      const [n] = store.getState().notifications.items
      expect(n.status).toBe('error')
      expect(n.title).toBe(
        'Unable to delete 1 asset. Please review any asset errors and try again.'
      )
    })
  })
})

describe('notificationsAssetsUploadCompleteEpic', () => {
  it('adds info notification from upload check results count', async () => {
    const store = createEpicTestStore(
      notificationsAssetsUploadCompleteEpic,
      createMockSanityClient({}),
      {}
    )
    store.dispatch(
      uploadsActions.checkComplete({
        results: {h1: 'id1', h2: null}
      })
    )
    await vi.waitFor(() => {
      expect(store.getState().notifications.items).toEqual([
        {asset: undefined, status: 'info', title: 'Uploaded 2 assets'}
      ])
    })
  })
})

const tagsWithTagUpdating = {
  allIds: ['t1'],
  byIds: {
    t1: {_type: 'tag' as const, tag: sampleTag, picked: false, updating: true}
  },
  creating: false,
  fetchCount: -1,
  fetching: false,
  panelVisible: true
}

describe('notificationsAssetsTagsAddCompleteEpic', () => {
  it('adds info notification with asset count', async () => {
    const store = createEpicTestStore(
      notificationsAssetsTagsAddCompleteEpic,
      createMockSanityClient({}),
      {
        assets: assetsWithRows({
          a1: {...assetItem(sampleAsset), updating: true},
          a2: {...assetItem(sampleAsset2), updating: true}
        }),
        tags: tagsWithTagUpdating
      }
    )
    store.dispatch(
      ASSETS_ACTIONS.tagsAddComplete({
        assets: [assetItem(sampleAsset), assetItem(sampleAsset2)],
        tag: sampleTag
      })
    )
    await vi.waitFor(() => {
      expect(store.getState().notifications.items).toEqual([
        {asset: undefined, status: 'info', title: 'Tag added to 2 assets'}
      ])
    })
  })
})

describe('notificationsAssetsTagsRemoveCompleteEpic', () => {
  it('adds info notification with asset count', async () => {
    const store = createEpicTestStore(
      notificationsAssetsTagsRemoveCompleteEpic,
      createMockSanityClient({}),
      {
        assets: assetsWithRows({
          a1: {...assetItem(sampleAsset), updating: true}
        }),
        tags: tagsWithTagUpdating
      }
    )
    store.dispatch(
      ASSETS_ACTIONS.tagsRemoveComplete({
        assets: [assetItem(sampleAsset)],
        tag: sampleTag
      })
    )
    await vi.waitFor(() => {
      expect(store.getState().notifications.items).toEqual([
        {asset: undefined, status: 'info', title: 'Tag removed from 1 asset'}
      ])
    })
  })
})

describe('notificationsAssetsUpdateCompleteEpic', () => {
  it('batches multiple updateComplete actions into one notification after buffer window', async () => {
    vi.useFakeTimers()
    const store = createEpicTestStore(
      notificationsAssetsUpdateCompleteEpic,
      createMockSanityClient({}),
      {
        assets: assetsWithRows({
          a1: {...assetItem(sampleAsset), updating: true},
          a2: {...assetItem(sampleAsset2), updating: true}
        })
      }
    )

    store.dispatch(assetsActions.updateComplete({asset: sampleAsset}))
    store.dispatch(assetsActions.updateComplete({asset: sampleAsset2}))
    await vi.advanceTimersByTimeAsync(2000)

    expect(store.getState().notifications.items).toEqual([
      {asset: undefined, status: 'info', title: '2 assets updated'}
    ])
    vi.useRealTimers()
  })

  it('emits separate notifications when updates fall in different buffer windows', async () => {
    vi.useFakeTimers()
    const store = createEpicTestStore(
      notificationsAssetsUpdateCompleteEpic,
      createMockSanityClient({}),
      {
        assets: assetsWithRows({
          a1: {...assetItem(sampleAsset), updating: true},
          a2: {...assetItem(sampleAsset2), updating: true}
        })
      }
    )

    store.dispatch(assetsActions.updateComplete({asset: sampleAsset}))
    await vi.advanceTimersByTimeAsync(2000)
    store.dispatch(assetsActions.updateComplete({asset: sampleAsset2}))
    await vi.advanceTimersByTimeAsync(2000)

    expect(store.getState().notifications.items).toEqual([
      {asset: undefined, status: 'info', title: '1 asset updated'},
      {asset: undefined, status: 'info', title: '1 asset updated'}
    ])
    vi.useRealTimers()
  })
})

describe('notificationsGenericErrorEpic', () => {
  it('maps assets.updateError to error notification title', async () => {
    const store = createEpicTestStore(notificationsGenericErrorEpic, createMockSanityClient({}), {
      assets: assetsWithRows({
        a1: {...assetItem(sampleAsset), updating: true}
      })
    })
    store.dispatch(
      assetsActions.updateError({
        asset: sampleAsset,
        error: {message: 'patch failed', statusCode: 500}
      })
    )
    await vi.waitFor(() => {
      expect(store.getState().notifications.items).toEqual([
        {asset: undefined, status: 'error', title: 'An error occurred: patch failed'}
      ])
    })
  })

  it('maps assets.fetchError (bare HttpError payload) to error notification title', async () => {
    const store = createEpicTestStore(notificationsGenericErrorEpic, createMockSanityClient({}), {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'] as AssetType[],
        fetching: true
      }
    })
    store.dispatch(
      assetsActions.fetchError({
        message: 'fetch failed',
        statusCode: 503
      })
    )
    await vi.waitFor(() => {
      expect(store.getState().notifications.items[0].title).toBe('An error occurred: fetch failed')
    })
  })

  it('maps tags.createError to error notification title', async () => {
    const store = createEpicTestStore(notificationsGenericErrorEpic, createMockSanityClient({}), {
      tags: {
        creating: true,
        creatingError: undefined,
        allIds: [],
        byIds: {},
        fetchCount: -1,
        fetching: false,
        panelVisible: true
      } as any
    })
    store.dispatch(
      tagsActions.createError({
        name: 'n',
        error: {message: 'tag create', statusCode: 400}
      })
    )
    await vi.waitFor(() => {
      expect(store.getState().notifications.items[0].title).toBe('An error occurred: tag create')
    })
  })

  it('maps uploads.uploadError to error notification title', async () => {
    const store = createEpicTestStore(notificationsGenericErrorEpic, createMockSanityClient({}), {
      uploads: {allIds: ['h'], byIds: {h: {} as any}}
    })
    store.dispatch(
      uploadsActions.uploadError({
        hash: 'h',
        error: {message: 'upload bad', statusCode: 413}
      })
    )
    await vi.waitFor(() => {
      expect(store.getState().notifications.items[0].title).toBe('An error occurred: upload bad')
    })
  })
})

describe('notificationsTagCreateCompleteEpic', () => {
  it('adds tag created notification', async () => {
    const store = createEpicTestStore(
      notificationsTagCreateCompleteEpic,
      createMockSanityClient({}),
      {}
    )
    store.dispatch(tagsActions.createComplete({tag: sampleTag}))
    await vi.waitFor(() => {
      expect(store.getState().notifications.items).toEqual([
        {asset: undefined, status: 'info', title: 'Tag created'}
      ])
    })
  })
})

describe('notificationsTagDeleteCompleteEpic', () => {
  it('adds tag deleted notification', async () => {
    const store = createEpicTestStore(
      notificationsTagDeleteCompleteEpic,
      createMockSanityClient({}),
      {}
    )
    store.dispatch(tagsActions.deleteComplete({tagId: 't1'}))
    await vi.waitFor(() => {
      expect(store.getState().notifications.items).toEqual([
        {asset: undefined, status: 'info', title: 'Tag deleted'}
      ])
    })
  })
})

describe('notificationsTagUpdateCompleteEpic', () => {
  it('adds tag updated notification', async () => {
    const store = createEpicTestStore(
      notificationsTagUpdateCompleteEpic,
      createMockSanityClient({}),
      {
        tags: {
          allIds: ['t1'],
          byIds: {
            t1: {_type: 'tag', tag: sampleTag, picked: false, updating: true}
          },
          creating: false,
          fetchCount: -1,
          fetching: false,
          panelVisible: true
        }
      }
    )
    store.dispatch(tagsActions.updateComplete({tag: sampleTag}))
    await vi.waitFor(() => {
      expect(store.getState().notifications.items).toEqual([
        {asset: undefined, status: 'info', title: 'Tag updated'}
      ])
    })
  })
})
