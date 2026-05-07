// @vitest-environment jsdom

import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import {of} from 'rxjs'
import {uploadsAssetStartEpic, uploadsCheckRequestEpic, uploadsActions} from './index'
import {createEpicTestStore} from '../../__tests__/fixtures/createEpicTestStore'
import {createMockSanityClient} from '../../__tests__/fixtures/mockSanityClient'
import {initialState as assetsInitialState} from '../assets'
import type {SanityImageAssetDocument} from '@sanity/client'

vi.mock('../../utils/generatePreviewBlobUrl', () => ({
  generatePreviewBlobUrl$: () => of('blob:http://preview')
}))

const uploadedAsset = {
  _id: 'asset-new',
  _type: 'sanity.imageAsset',
  sha1hash: 'deadbeef',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r',
  originalFilename: 'f.png',
  mimeType: 'image/png',
  size: 10,
  url: ''
} as SanityImageAssetDocument

vi.mock('../../utils/uploadSanityAsset', () => ({
  uploadAsset$: () =>
    of({
      type: 'complete' as const,
      asset: uploadedAsset
    }),
  hashFile$: () => of('deadbeef'),
  withMaxConcurrency: (fn: unknown) => fn
}))

describe('uploadsAssetStartEpic', () => {
  it('dispatches preview, progress path, and uploadComplete', async () => {
    const client = createMockSanityClient()

    const store = createEpicTestStore(uploadsAssetStartEpic, client)

    const file = new File(['x'], 'f.png', {type: 'image/png'})
    const uploadItem = {
      _type: 'upload' as const,
      assetType: 'image' as const,
      hash: 'deadbeef',
      name: 'f.png',
      size: file.size,
      status: 'queued' as const
    }

    store.dispatch(uploadsActions.uploadStart({file, uploadItem}))

    await vi.waitFor(() => {
      expect(store.getState().uploads.byIds.deadbeef?.objectUrl).toBe('blob:http://preview')
    })

    await vi.waitFor(() => {
      expect(store.getState().assets.byIds['asset-new']).toBeDefined()
    })
  })
})

describe('uploadsCheckRequestEpic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('after delay, fetches sha hashes and dispatches checkComplete + insertUploads', async () => {
    const client = createMockSanityClient({
      observable: {
        fetch: vi.fn(() => of(['hh']))
      }
    })

    const store = createEpicTestStore(uploadsCheckRequestEpic, client, {
      assets: {...assetsInitialState, assetTypes: ['image']}
    })

    const asset = {
      _id: 'id-1',
      _type: 'sanity.imageAsset',
      sha1hash: 'hh',
      _createdAt: '',
      _updatedAt: '',
      _rev: 'r',
      originalFilename: 'f.png',
      mimeType: 'image/png',
      size: 1,
      url: ''
    } as SanityImageAssetDocument

    store.dispatch(uploadsActions.checkRequest({assets: [asset]}))

    await vi.advanceTimersByTimeAsync(1100)

    await vi.waitFor(() => {
      expect(client.observable.fetch).toHaveBeenCalled()
      expect(store.getState().uploads.byIds.hh).toBeUndefined()
    })
  })
})
