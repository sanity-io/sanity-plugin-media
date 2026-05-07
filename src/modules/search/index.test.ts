// @vitest-environment node

import {describe, expect, it} from 'vitest'
import searchReducer, {searchActions} from './index'
import {inputs} from '../../config/searchFacets'

describe('search slice', () => {
  it('facetsAdd assigns an id and appends facet', () => {
    let state = searchReducer(undefined, {type: '@@INIT'} as never)
    state = searchReducer(state, searchActions.facetsAdd({facet: {...inputs.title}}))
    expect(state.facets).toHaveLength(1)
    expect(state.facets[0].name).toBe('title')
    expect(state.facets[0].id).toBeDefined()
  })

  it('querySet updates search string', () => {
    let state = searchReducer(undefined, {type: '@@INIT'} as never)
    state = searchReducer(state, searchActions.querySet({searchQuery: 'cats'}))
    expect(state.query).toBe('cats')
  })

  it('facetsClear removes all facets', () => {
    let state = searchReducer(undefined, {type: '@@INIT'} as never)
    state = searchReducer(state, searchActions.facetsAdd({facet: {...inputs.title}}))
    state = searchReducer(state, searchActions.facetsClear())
    expect(state.facets).toHaveLength(0)
  })

  it('facetsRemoveByName filters facets', () => {
    let state = searchReducer(undefined, {type: '@@INIT'} as never)
    state = searchReducer(state, searchActions.facetsAdd({facet: {...inputs.title}}))
    state = searchReducer(state, searchActions.facetsRemoveByName({facetName: 'title'}))
    expect(state.facets).toHaveLength(0)
  })
})
