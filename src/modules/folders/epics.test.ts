// @vitest-environment node

import {describe, expect, it, vi} from 'vitest'
import {of} from 'rxjs'
import {createEpicTestStore} from '../../__tests__/fixtures/createEpicTestStore'
import {
  createMockSanityClient,
  mockTransactionCommit
} from '../../__tests__/fixtures/mockSanityClient'
import {foldersActions, foldersDeleteEpic} from './index'

describe('foldersDeleteEpic', () => {
  it('deletes only the selected folder, unsets direct asset refs, and promotes child folders', async () => {
    const tx = mockTransactionCommit(undefined)
    const client = createMockSanityClient({
      observable: {
        fetch: vi.fn(() => of({assets: [{_id: 'asset-in-folder'}]}))
      },
      transaction: vi.fn(() => tx)
    })

    const store = createEpicTestStore(foldersDeleteEpic, client, {
      assets: {
        assetTypes: ['image'],
        allIds: [],
        byIds: {},
        fetchCount: -1,
        fetching: false,
        order: {_updatedAt: 'desc'} as never,
        pageIndex: 0,
        pageSize: 100,
        view: 'grid'
      },
      folders: {
        byId: {
          parent: {_id: 'parent', name: 'Parent', parentId: null},
          target: {_id: 'target', name: 'Target', parentId: 'parent'},
          child: {_id: 'child', name: 'Child', parentId: 'target'}
        },
        childrenByParentId: {
          parent: ['target'],
          target: ['child']
        },
        rootIds: ['parent'],
        exactCountByFolderId: {},
        unfiledCount: 0,
        currentFolderId: 'target',
        currentFolderUnfiled: false,
        panelVisible: false,
        fetching: false,
        fetchCount: -1,
        creating: false,
        renaming: false,
        moving: false
      }
    })

    store.dispatch(foldersActions.deleteRequest({folderId: 'target'}))

    await vi.waitFor(() => {
      expect(client.observable.fetch).toHaveBeenCalledWith(expect.any(String), {folderId: 'target'})
      expect(tx.delete).toHaveBeenCalledTimes(1)
      expect(tx.delete).toHaveBeenCalledWith('target')
      expect(tx.delete).not.toHaveBeenCalledWith('asset-in-folder')
      expect(tx.delete).not.toHaveBeenCalledWith('child')
      expect(tx.commit).toHaveBeenCalled()
    })

    const assetPatch = tx.patch.mock.calls.find(([id]) => id === 'asset-in-folder')?.[1]
    const childPatch = tx.patch.mock.calls.find(([id]) => id === 'child')?.[1]
    const assetUnset = vi.fn().mockReturnThis()
    const childSet = vi.fn().mockReturnThis()

    assetPatch?.({unset: assetUnset})
    childPatch?.({set: childSet})

    expect(assetUnset).toHaveBeenCalledWith(['opt.media.folder'])
    expect(childSet).toHaveBeenCalledWith({
      parent: {_ref: 'parent', _type: 'reference', _weak: true}
    })
    expect(store.getState().folders.currentFolderId).toBeNull()
  })

  it('moves child folders to root when deleting a root folder', async () => {
    const tx = mockTransactionCommit(undefined)
    const client = createMockSanityClient({
      observable: {
        fetch: vi.fn(() => of({assets: []}))
      },
      transaction: vi.fn(() => tx)
    })

    const store = createEpicTestStore(foldersDeleteEpic, client, {
      assets: {
        assetTypes: ['image'],
        allIds: [],
        byIds: {},
        fetchCount: -1,
        fetching: false,
        order: {_updatedAt: 'desc'} as never,
        pageIndex: 0,
        pageSize: 100,
        view: 'grid'
      },
      folders: {
        byId: {
          target: {_id: 'target', name: 'Target', parentId: null},
          child: {_id: 'child', name: 'Child', parentId: 'target'}
        },
        childrenByParentId: {
          target: ['child']
        },
        rootIds: ['target'],
        exactCountByFolderId: {},
        unfiledCount: 0,
        currentFolderId: null,
        currentFolderUnfiled: false,
        panelVisible: false,
        fetching: false,
        fetchCount: -1,
        creating: false,
        renaming: false,
        moving: false
      }
    })

    store.dispatch(foldersActions.deleteRequest({folderId: 'target'}))

    await vi.waitFor(() => {
      expect(tx.commit).toHaveBeenCalled()
    })

    const childPatch = tx.patch.mock.calls.find(([id]) => id === 'child')?.[1]
    const childUnset = vi.fn().mockReturnThis()

    childPatch?.({unset: childUnset})

    expect(childUnset).toHaveBeenCalledWith(['parent'])
  })
})
