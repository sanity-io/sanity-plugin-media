// @vitest-environment node

import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import {
  assetsActions,
  assetsListenerCreateQueueEpic,
  assetsListenerDeleteQueueEpic,
  assetsListenerUpdateQueueEpic,
  assetsTagsAddEpic,
  assetsTagsRemoveEpic
} from './index'
import {ASSETS_ACTIONS} from './actions'
import {createEpicTestStore} from '../../__tests__/fixtures/createEpicTestStore'
import {
  createMockSanityClient,
  mockTransactionCommit
} from '../../__tests__/fixtures/mockSanityClient'
import {initialState as assetsInitialState} from './index'
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
  url: ''
} as ImageAsset

const sampleTag: Tag = {
  _id: 't1',
  _type: 'media.tag',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'tr',
  name: {_type: 'slug', current: 'tag-a'}
}

describe('assetsTagsAddEpic', () => {
  it('runs transaction.commit when adding tag to picked assets', async () => {
    const tx = mockTransactionCommit(undefined)
    const client = createMockSanityClient({
      transaction: vi.fn(() => tx)
    })

    const assetItem = {
      _type: 'asset' as const,
      asset: sampleAsset,
      picked: true,
      updating: false
    }

    const store = createEpicTestStore(assetsTagsAddEpic, client, {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {a1: assetItem}
      },
      tags: {
        allIds: ['t1'],
        byIds: {
          t1: {_type: 'tag', tag: sampleTag, picked: false, updating: false}
        },
        creating: false,
        fetchCount: -1,
        fetching: false,
        panelVisible: true
      }
    })

    store.dispatch(
      ASSETS_ACTIONS.tagsAddRequest({
        assets: [assetItem],
        tag: sampleTag
      })
    )

    await vi.waitFor(() => {
      expect(tx.commit).toHaveBeenCalled()
    })
  })
})

describe('assetsTagsRemoveEpic', () => {
  it('runs transaction.commit for tag removal', async () => {
    const tx = mockTransactionCommit(undefined)
    const client = createMockSanityClient({
      transaction: vi.fn(() => tx)
    })

    const assetItem = {
      _type: 'asset' as const,
      asset: sampleAsset,
      picked: true,
      updating: false
    }

    const store = createEpicTestStore(assetsTagsRemoveEpic, client, {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {a1: assetItem}
      },
      tags: {
        allIds: ['t1'],
        byIds: {
          t1: {_type: 'tag', tag: sampleTag, picked: false, updating: false}
        },
        creating: false,
        fetchCount: -1,
        fetching: false,
        panelVisible: true
      }
    })

    store.dispatch(
      ASSETS_ACTIONS.tagsRemoveRequest({
        assets: [assetItem],
        tag: sampleTag
      })
    )

    await vi.waitFor(() => {
      expect(tx.commit).toHaveBeenCalled()
    })
  })
})

describe('assets listener queue epics', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('assetsListenerCreateQueueEpic batches creates after buffer window', async () => {
    const store = createEpicTestStore(assetsListenerCreateQueueEpic, createMockSanityClient(), {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {
          a1: {_type: 'asset', asset: sampleAsset, picked: false, updating: false}
        }
      }
    })

    const updated = {...sampleAsset, title: 'L'}
    store.dispatch(assetsActions.listenerCreateQueue({asset: updated}))

    await vi.advanceTimersByTimeAsync(2000)

    await vi.waitFor(() => {
      expect(store.getState().assets.byIds.a1.asset.title).toBe('L')
    })
  })

  it('assetsListenerDeleteQueueEpic batches deletes', async () => {
    const store = createEpicTestStore(assetsListenerDeleteQueueEpic, createMockSanityClient(), {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {
          a1: {_type: 'asset', asset: sampleAsset, picked: false, updating: false}
        }
      }
    })

    store.dispatch(assetsActions.listenerDeleteQueue({assetId: 'a1'}))
    await vi.advanceTimersByTimeAsync(2000)

    await vi.waitFor(() => {
      expect(store.getState().assets.byIds.a1).toBeUndefined()
    })
  })

  it('assetsListenerUpdateQueueEpic batches updates', async () => {
    const store = createEpicTestStore(assetsListenerUpdateQueueEpic, createMockSanityClient(), {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {
          a1: {_type: 'asset', asset: sampleAsset, picked: false, updating: false}
        }
      }
    })

    const updated = {...sampleAsset, title: 'Buffered'}
    store.dispatch(assetsActions.listenerUpdateQueue({asset: updated}))
    await vi.advanceTimersByTimeAsync(2000)

    await vi.waitFor(() => {
      expect(store.getState().assets.byIds.a1.asset.title).toBe('Buffered')
    })
  })
})
