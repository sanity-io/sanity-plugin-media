// @vitest-environment node

import {describe, expect, it, vi} from 'vitest'
import {of, throwError} from 'rxjs'
import {assetsActions, assetsFetchEpic} from './index'
import {createEpicTestStore} from '../../__tests__/fixtures/createEpicTestStore'
import {createMockSanityClient} from '../../__tests__/fixtures/mockSanityClient'
import type {ImageAsset} from '../../types'

function assertFetchSucceeded(store: ReturnType<typeof createEpicTestStore>, asset: ImageAsset) {
  expect(store.getState().assets.byIds.a1?.asset).toEqual(asset)
  expect(store.getState().assets.fetching).toBe(false)
}

function assertFetchFailed(store: ReturnType<typeof createEpicTestStore>) {
  expect(store.getState().assets.fetchingError?.message).toBe('boom')
}

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

describe('assetsFetchEpic', () => {
  it('dispatches fetchComplete when observable.fetch succeeds', async () => {
    const client = createMockSanityClient({
      observable: {
        fetch: vi.fn(() => of({items: [sampleAsset]}))
      }
    })

    const store = createEpicTestStore(assetsFetchEpic, client)
    store.dispatch(
      assetsActions.fetchRequest({
        params: {},
        queryFilter: '_type == "sanity.imageAsset"',
        selector: '',
        sort: ''
      })
    )

    await vi.waitFor(() => assertFetchSucceeded(store, sampleAsset))
  })

  it('dispatches fetchError when fetch fails', async () => {
    const fetchErr = throwError(() => ({message: 'boom', statusCode: 500}))
    const client = createMockSanityClient({
      observable: {
        fetch: vi.fn(() => fetchErr)
      }
    })

    const store = createEpicTestStore(assetsFetchEpic, client)
    store.dispatch(
      assetsActions.fetchRequest({
        params: {},
        queryFilter: '_type == "sanity.imageAsset"',
        selector: '',
        sort: ''
      })
    )

    await vi.waitFor(() => assertFetchFailed(store))
  })
})
