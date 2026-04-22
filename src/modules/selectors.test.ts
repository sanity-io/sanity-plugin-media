// @vitest-environment node

import {describe, expect, it} from 'vitest'
import type {RootReducerState} from './types'
import {selectCombinedItems} from './selectors'

describe('selectCombinedItems', () => {
  it('places upload items before asset items', () => {
    const state = {
      assets: {allIds: ['a1', 'a2']},
      uploads: {allIds: ['u1']}
    } as RootReducerState

    expect(selectCombinedItems(state)).toEqual([
      {id: 'u1', type: 'upload'},
      {id: 'a1', type: 'asset'},
      {id: 'a2', type: 'asset'}
    ])
  })
})
