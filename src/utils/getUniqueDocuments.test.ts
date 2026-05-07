import {describe, expect, it} from 'vitest'
import type {SanityDocument} from '@sanity/client'
import {getUniqueDocuments} from './getUniqueDocuments'

describe('getUniqueDocuments', () => {
  it('drops published documents when a drafts.* sibling exists', () => {
    const docs: SanityDocument[] = [
      {_id: 'drafts.post1', _type: 'post'} as SanityDocument,
      {_id: 'post1', _type: 'post'} as SanityDocument
    ]
    expect(getUniqueDocuments(docs)).toEqual([{_id: 'drafts.post1', _type: 'post'}])
  })

  it('keeps published-only and draft-only ids', () => {
    const docs: SanityDocument[] = [
      {_id: 'onlyPub', _type: 'x'} as SanityDocument,
      {_id: 'drafts.onlyDraft', _type: 'x'} as SanityDocument
    ]
    expect(getUniqueDocuments(docs)).toEqual(docs)
  })

  it('returns an empty array for an empty list', () => {
    expect(getUniqueDocuments([])).toEqual([])
  })
})
