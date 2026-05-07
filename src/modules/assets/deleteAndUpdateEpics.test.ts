// @vitest-environment node

import {describe, expect, it, vi} from 'vitest'
import {of} from 'rxjs'
import {
  assetsActions,
  assetsDeleteEpic,
  assetsUpdateEpic,
  initialState as assetsInitialState
} from './index'
import {createEpicTestStore} from '../../__tests__/fixtures/createEpicTestStore'
import {createMockSanityClient, mockPatchChain} from '../../__tests__/fixtures/mockSanityClient'
import type {ImageAsset} from '../../types'

const sampleAsset = {
  _id: 'a1',
  _type: 'sanity.imageAsset',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r',
  originalFilename: 'x.png',
  size: 1,
  mimeType: 'image/png',
  url: ''
} as ImageAsset

describe('assetsDeleteEpic', () => {
  it('dispatches deleteComplete when observable.delete succeeds', async () => {
    const client = createMockSanityClient({
      observable: {
        delete: vi.fn(() => of({}))
      }
    })

    const store = createEpicTestStore(assetsDeleteEpic, client, {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {
          a1: {_type: 'asset', asset: sampleAsset, picked: false, updating: false}
        }
      }
    })

    store.dispatch(assetsActions.deleteRequest({assets: [sampleAsset]}))

    await vi.waitFor(() => {
      expect(store.getState().assets.byIds.a1).toBeUndefined()
      expect(client.observable.delete).toHaveBeenCalled()
    })
  })
})

describe('assetsUpdateEpic', () => {
  it('commits patch and dispatches updateComplete', async () => {
    const updated = {...sampleAsset, title: 'Updated'}
    const chain = mockPatchChain(updated)
    const client = createMockSanityClient({
      patch: vi.fn(() => chain)
    })

    const store = createEpicTestStore(assetsUpdateEpic, client, {
      assets: {
        ...assetsInitialState,
        assetTypes: ['image'],
        allIds: ['a1'],
        byIds: {
          a1: {_type: 'asset', asset: sampleAsset, picked: false, updating: false}
        }
      }
    })

    store.dispatch(
      assetsActions.updateRequest({
        asset: sampleAsset,
        formData: {title: 'Updated'}
      })
    )

    await vi.waitFor(() => {
      expect(chain.commit).toHaveBeenCalled()
      expect(store.getState().assets.byIds.a1.asset.title).toBe('Updated')
    })
  })
})
