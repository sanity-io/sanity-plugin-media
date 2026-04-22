// @vitest-environment node

import {describe, expect, it} from 'vitest'
import type {Tag} from '../../types'
import tagsReducer, {tagsActions} from './index'

const sampleTag: Tag = {
  _id: 'tag-1',
  _type: 'media.tag',
  _createdAt: '2020-01-01',
  _updatedAt: '2020-01-01',
  _rev: 'r1',
  name: {_type: 'slug', current: 'alpha'}
}

describe('tags slice', () => {
  it('createComplete adds tag', () => {
    let state = tagsReducer(undefined, {type: '@@INIT'} as never)
    state = tagsReducer(state, tagsActions.createComplete({tag: sampleTag}))
    expect(state.allIds).toContain('tag-1')
    expect(state.byIds['tag-1'].tag).toEqual(sampleTag)
    expect(state.creating).toBe(false)
  })

  it('deleteComplete removes tag', () => {
    let state = tagsReducer(undefined, {type: '@@INIT'} as never)
    state = tagsReducer(state, tagsActions.createComplete({tag: sampleTag}))
    state = tagsReducer(state, tagsActions.deleteComplete({tagId: 'tag-1'}))
    expect(state.allIds).not.toContain('tag-1')
    expect(state.byIds['tag-1']).toBeUndefined()
  })

  it('fetchComplete hydrates tag list', () => {
    let state = tagsReducer(undefined, {type: '@@INIT'} as never)
    state = tagsReducer(state, tagsActions.fetchRequest())
    expect(state.fetching).toBe(true)
    state = tagsReducer(state, tagsActions.fetchComplete({tags: [sampleTag]}))
    expect(state.fetching).toBe(false)
    expect(state.byIds['tag-1'].tag).toEqual(sampleTag)
  })
})
