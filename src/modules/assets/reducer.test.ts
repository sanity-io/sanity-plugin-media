// @vitest-environment node

import {describe, expect, it} from 'vitest'
import type {AssetType, ImageAsset} from '../../types'
import assetsReducer, {assetsActions, initialState, type AssetsReducerState} from './index'

const minimalImage = {
  _id: 'img-1',
  _type: 'sanity.imageAsset',
  _createdAt: '2020-01-01',
  _updatedAt: '2020-01-01',
  _rev: 'r1',
  originalFilename: 'a.png',
  size: 1,
  mimeType: 'image/png',
  url: 'https://example.com/a.png'
} as ImageAsset

describe('assets slice', () => {
  function stateWithOneAsset(): AssetsReducerState {
    return {
      ...initialState,
      assetTypes: ['image'] as AssetType[],
      allIds: ['img-1'],
      byIds: {
        'img-1': {
          _type: 'asset',
          asset: minimalImage,
          picked: false,
          updating: false
        }
      }
    }
  }

  it('pick toggles picked flag', () => {
    let state = stateWithOneAsset()
    state = assetsReducer(state, assetsActions.pick({assetId: 'img-1', picked: true}))
    expect(state.byIds['img-1'].picked).toBe(true)
    expect(state.lastPicked).toBe('img-1')
  })

  it('pickClear clears selection', () => {
    let state = stateWithOneAsset()
    state = assetsReducer(state, assetsActions.pick({assetId: 'img-1', picked: true}))
    state = assetsReducer(state, assetsActions.pickClear())
    expect(state.byIds['img-1'].picked).toBe(false)
    expect(state.lastPicked).toBeUndefined()
  })

  it('fetchComplete merges assets', () => {
    let state = assetsReducer({...initialState, assetTypes: ['image'] as AssetType[]}, {
      type: '@@INIT'
    } as never)
    state = assetsReducer(state, assetsActions.fetchComplete({assets: [minimalImage]}))
    expect(state.allIds).toContain('img-1')
    expect(state.fetching).toBe(false)
    expect(state.fetchCount).toBe(1)
  })

  it('orderSet resets page index', () => {
    let state: AssetsReducerState = {
      ...initialState,
      assetTypes: ['image'] as AssetType[],
      pageIndex: 3
    }
    state = assetsReducer(
      state,
      assetsActions.orderSet({
        order: {field: 'size', direction: 'asc'}
      })
    )
    expect(state.pageIndex).toBe(0)
    expect(state.order.field).toBe('size')
  })

  it('listenerDeleteQueueComplete removes assets', () => {
    let state = stateWithOneAsset()
    state = assetsReducer(state, assetsActions.listenerDeleteQueueComplete({assetIds: ['img-1']}))
    expect(state.allIds).toHaveLength(0)
    expect(state.byIds['img-1']).toBeUndefined()
  })

  it('listenerUpdateQueueComplete updates asset document', () => {
    let state = stateWithOneAsset()
    const updated = {...minimalImage, title: 'New'}
    state = assetsReducer(state, assetsActions.listenerUpdateQueueComplete({assets: [updated]}))
    expect(state.byIds['img-1'].asset.title).toBe('New')
  })
})
