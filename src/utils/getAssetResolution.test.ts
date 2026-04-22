import {describe, expect, it} from 'vitest'
import getAssetResolution from './getAssetResolution'
import type {ImageAsset} from '../types'

describe('getAssetResolution', () => {
  it('formats width x height with px suffix', () => {
    const asset = {
      metadata: {dimensions: {width: 1920, height: 1080}}
    } as ImageAsset
    expect(getAssetResolution(asset)).toBe('1920x1080px')
  })
})
