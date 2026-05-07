import {describe, expect, it} from 'vitest'
import {isSupportedAssetType} from './isSupportedAssetType'

describe('isSupportedAssetType', () => {
  it('returns true for file and image', () => {
    expect(isSupportedAssetType('file')).toBe(true)
    expect(isSupportedAssetType('image')).toBe(true)
  })

  it('returns false for unsupported or missing types', () => {
    expect(isSupportedAssetType('video')).toBe(false)
    expect(isSupportedAssetType('')).toBe(false)
    expect(isSupportedAssetType(undefined)).toBe(false)
  })
})
