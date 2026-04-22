// @vitest-environment node

import {describe, expect, it, vi} from 'vitest'
import {of} from 'rxjs'
import {tagsCreateEpic, tagsDeleteEpic, tagsActions} from './index'
import {createEpicTestStore} from '../../__tests__/fixtures/createEpicTestStore'
import {
  createMockSanityClient,
  mockTransactionCommit
} from '../../__tests__/fixtures/mockSanityClient'
import type {Tag} from '../../types'

const sampleTag: Tag = {
  _id: 't1',
  _type: 'media.tag',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'tr',
  name: {_type: 'slug', current: 'alpha'}
}

describe('tagsCreateEpic', () => {
  it('creates tag when checkTagName passes', async () => {
    const client = createMockSanityClient({
      fetch: vi.fn().mockResolvedValue(0),
      observable: {
        create: vi.fn(() => of(sampleTag))
      }
    })

    const store = createEpicTestStore(tagsCreateEpic, client)
    store.dispatch(tagsActions.createRequest({name: 'alpha'}))

    await vi.waitFor(() => {
      expect(store.getState().tags.byIds.t1?.tag).toEqual(sampleTag)
      expect(client.observable.create).toHaveBeenCalled()
    })
  })

  it('dispatches createError when tag exists', async () => {
    const client = createMockSanityClient({
      fetch: vi.fn().mockResolvedValue(1),
      observable: {
        create: vi.fn(() => of(sampleTag))
      }
    })

    const store = createEpicTestStore(tagsCreateEpic, client)
    store.dispatch(tagsActions.createRequest({name: 'dup'}))

    await vi.waitFor(() => {
      expect(store.getState().tags.creatingError?.statusCode).toBe(409)
      expect(client.observable.create).not.toHaveBeenCalled()
    })
  })
})

describe('tagsDeleteEpic', () => {
  it('fetches referencing assets and commits transaction', async () => {
    const tx = mockTransactionCommit(undefined)
    const client = createMockSanityClient({
      observable: {
        fetch: vi.fn(() =>
          of([
            {_id: 'a1', _rev: 'r1', opt: {}},
            {_id: 'a2', _rev: 'r2', opt: {}}
          ])
        )
      },
      transaction: vi.fn(() => tx)
    })

    const store = createEpicTestStore(tagsDeleteEpic, client, {
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

    store.dispatch(tagsActions.deleteRequest({tag: sampleTag}))

    await vi.waitFor(() => {
      expect(tx.patch).toHaveBeenCalled()
      expect(tx.delete).toHaveBeenCalledWith('t1')
      expect(tx.commit).toHaveBeenCalled()
      expect(store.getState().tags.byIds.t1).toBeUndefined()
    })
  })
})
