// @vitest-environment node

import {describe, expect, it} from 'vitest'
import {inputs} from '../config/searchFacets'
import type {SearchFacetInputProps} from '../types'
import constructFilter from './constructFilter'

describe('constructFilter', () => {
  it('includes base filter that excludes drafts and restricts asset types', () => {
    const q = constructFilter({
      assetTypes: ['image', 'file'],
      searchFacets: [],
      searchQuery: undefined
    })

    expect(q).toContain('_type in ["sanity.imageAsset","sanity.fileAsset"]')
    expect(q).toContain('!(_id in path("drafts.**"))')
  })

  it('limits to a single asset type in picker mode', () => {
    const q = constructFilter({
      assetTypes: ['image'],
      searchFacets: [],
      searchQuery: undefined
    })

    expect(q).toContain('_type in ["sanity.imageAsset"]')
  })

  it('appends text search on trimmed query', () => {
    const q = constructFilter({
      assetTypes: ['file', 'image'],
      searchFacets: [],
      searchQuery: '  hello  '
    })

    expect(q).toContain(
      "[_id, altText, assetId, creditLine, description, originalFilename, title, url] match '*hello*'"
    )
  })

  it('composes number facet with field modifier (size / KB)', () => {
    const q = constructFilter({
      assetTypes: ['image'],
      searchFacets: [{...inputs.size, value: 500} as SearchFacetInputProps],
      searchQuery: undefined
    })

    expect(q.replace(/\s+/g, ' ')).toContain('round(size / 1000) > 500')
  })

  it('composes searchable tag facet (references)', () => {
    const facet = {
      ...inputs.tag,
      operatorType: 'references' as const,
      value: {label: 'T', value: 'tag-id-1'}
    } as SearchFacetInputProps

    const q = constructFilter({
      assetTypes: ['image', 'file'],
      searchFacets: [facet],
      searchQuery: undefined
    })

    expect(q).toContain("references('tag-id-1')")
  })

  it('composes select facet (inUse)', () => {
    const q = constructFilter({
      assetTypes: ['image', 'file'],
      searchFacets: [structuredClone(inputs.inUse)],
      searchQuery: undefined
    })

    expect(q).toContain('count(*[references(^._id)]) > 0')
  })

  it('AND-joins base filter, search text, and multiple facets', () => {
    const q = constructFilter({
      assetTypes: ['image', 'file'],
      searchFacets: [{...inputs.title}, {...inputs.inUse}],
      searchQuery: 'x'
    })

    const parts = q.split(' && ')
    expect(parts.length).toBeGreaterThanOrEqual(4)
  })

  it('matches snapshot for stable GROQ shape (apiVersion / filter regressions)', () => {
    const q = constructFilter({
      assetTypes: ['file', 'image'],
      searchFacets: [
        {...inputs.size, value: 100} as SearchFacetInputProps,
        {
          ...inputs.tag,
          operatorType: 'references',
          value: {label: 'Example', value: 'abc123'}
        } as SearchFacetInputProps
      ],
      searchQuery: 'portrait'
    })

    const normalized = q.replace(/\s+/g, ' ').trim()

    expect(normalized).toBe(
      '_type in ["sanity.fileAsset","sanity.imageAsset"] && !(_id in path("drafts.**")) && [_id, altText, assetId, creditLine, description, originalFilename, title, url] match \'*portrait*\' && round(size / 1000) > 100 && references(\'abc123\')'
    )
  })

  it('omits text search fragment when searchQuery is undefined', () => {
    const q = constructFilter({
      assetTypes: ['image', 'file'],
      searchFacets: [],
      searchQuery: undefined
    })

    expect(q).not.toContain('match ')
  })
})
