// @vitest-environment node

import {describe, expect, it} from 'vitest'
import notificationsReducer, {notificationsActions} from './index'
import type {ImageAsset} from '../../types'
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

describe('notificationsReducer', () => {
  it('starts with no items', () => {
    const state = notificationsReducer(undefined, {type: '@@init'})
    expect(state.items).toEqual([])
  })

  it('add appends a notification with asset, status, and title', () => {
    const prev = createTestRootState().notifications
    const next = notificationsReducer(
      prev,
      notificationsActions.add({
        asset: sampleAsset,
        status: 'success',
        title: 'Done'
      })
    )
    expect(next.items).toHaveLength(1)
    expect(next.items[0]).toEqual({
      asset: sampleAsset,
      status: 'success',
      title: 'Done'
    })
  })

  it('add allows partial payloads', () => {
    let state = createTestRootState().notifications
    state = notificationsReducer(state, notificationsActions.add({status: 'error', title: 'X'}))
    state = notificationsReducer(state, notificationsActions.add({title: 'Y'}))
    expect(state.items).toEqual([
      {asset: undefined, status: 'error', title: 'X'},
      {asset: undefined, status: undefined, title: 'Y'}
    ])
  })
})
