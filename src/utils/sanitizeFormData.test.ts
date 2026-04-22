// @vitest-environment node

import {describe, expect, it} from 'vitest'
import sanitizeFormData from './sanitizeFormData'

describe('sanitizeFormData', () => {
  it('maps empty string, undefined, and empty array to null', () => {
    expect(
      sanitizeFormData({
        a: '',
        b: undefined,
        c: []
      })
    ).toEqual({
      a: null,
      b: null,
      c: null
    })
  })

  it('trims non-empty strings', () => {
    expect(sanitizeFormData({title: '  hello  '})).toEqual({title: 'hello'})
  })

  it('recurses into plain objects', () => {
    expect(
      sanitizeFormData({
        opt: {
          media: {
            tags: []
          }
        }
      })
    ).toEqual({
      opt: {
        media: {
          tags: null
        }
      }
    })
  })

  it('preserves null and non-empty arrays', () => {
    expect(
      sanitizeFormData({
        kept: null,
        tags: [{_ref: 't1'}]
      })
    ).toEqual({
      kept: null,
      tags: [{_ref: 't1'}]
    })
  })

  it('preserves numbers and booleans', () => {
    expect(sanitizeFormData({n: 0, ok: false})).toEqual({n: 0, ok: false})
  })
})
