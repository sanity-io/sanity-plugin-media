// @vitest-environment node

import {describe, expect, it} from 'vitest'
import {assetFormSchema, tagFormSchema, tagOptionSchema} from './index'

describe('tagOptionSchema', () => {
  it('accepts trimmed non-empty label and value', () => {
    expect(tagOptionSchema.safeParse({label: 'A', value: 'b'}).success).toBe(true)
  })

  it('rejects empty label or value after trim', () => {
    expect(tagOptionSchema.safeParse({label: '  ', value: 'x'}).success).toBe(false)
    expect(tagOptionSchema.safeParse({label: 'x', value: ''}).success).toBe(false)
  })
})

describe('tagFormSchema', () => {
  it('requires non-empty name', () => {
    expect(tagFormSchema.safeParse({name: 'x'}).success).toBe(true)
    expect(tagFormSchema.safeParse({name: ''}).success).toBe(false)
  })
})

describe('assetFormSchema', () => {
  const base = {
    altText: '',
    creditLine: '',
    description: '',
    opt: {media: {tags: null}},
    originalFilename: 'file.png',
    title: ''
  }

  it('accepts valid asset form payload', () => {
    expect(assetFormSchema.safeParse(base).success).toBe(true)
  })

  it('rejects empty originalFilename', () => {
    expect(
      assetFormSchema.safeParse({
        ...base,
        originalFilename: '   '
      }).success
    ).toBe(false)
  })

  it('validates nested tag options', () => {
    expect(
      assetFormSchema.safeParse({
        ...base,
        opt: {media: {tags: [{label: '', value: 'v'}]}}
      }).success
    ).toBe(false)
  })
})
