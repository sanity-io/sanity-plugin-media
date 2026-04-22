import {describe, expect, it} from 'vitest'
import {isFileAsset, isImageAsset} from './typeGuards'
import type {Asset} from '../types'

describe('typeGuards', () => {
  it('isFileAsset narrows sanity.fileAsset', () => {
    const file = {_type: 'sanity.fileAsset'} as Asset
    expect(isFileAsset(file)).toBe(true)
    expect(isImageAsset(file)).toBe(false)
  })

  it('isImageAsset narrows sanity.imageAsset', () => {
    const image = {_type: 'sanity.imageAsset'} as Asset
    expect(isImageAsset(image)).toBe(true)
    expect(isFileAsset(image)).toBe(false)
  })
})
