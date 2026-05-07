// @vitest-environment node

import {describe, expect, it} from 'vitest'
import getDocumentAssetIds from './getDocumentAssetIds'

describe('getDocumentAssetIds', () => {
  it('returns empty array for document without asset refs', () => {
    expect(getDocumentAssetIds({_id: 'doc1', _type: 'post'} as any)).toEqual([])
  })

  it('collects asset _ref from nested portable text–like structures', () => {
    const doc = {
      _id: 'doc1',
      _type: 'post',
      body: [
        {
          _type: 'block',
          asset: {_type: 'reference', _ref: 'image-asset-1'}
        }
      ]
    } as any

    expect(getDocumentAssetIds(doc)).toEqual(['image-asset-1'])
  })

  it('dedupes and sorts refs', () => {
    const doc = {
      _id: 'doc1',
      _type: 'post',
      modules: [
        {image: {asset: {_type: 'reference', _ref: 'b'}}},
        {image: {asset: {_type: 'reference', _ref: 'a'}}},
        {image: {asset: {_type: 'reference', _ref: 'b'}}}
      ]
    } as any

    expect(getDocumentAssetIds(doc)).toEqual(['a', 'b'])
  })

  it('ignores reference nodes that are not asset references', () => {
    const doc = {
      _id: 'doc1',
      _type: 'post',
      author: {_type: 'reference', _ref: 'person-1'}
    } as any

    expect(getDocumentAssetIds(doc)).toEqual([])
  })
})
