import {afterEach, describe, expect, it} from 'vitest'
import imageDprUrl from './imageDprUrl'
import type {ImageAsset} from '../types'

const asset = {
  _id: 'a1',
  _type: 'sanity.imageAsset',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r1',
  originalFilename: 'x.png',
  size: 1,
  mimeType: 'image/png',
  url: 'https://cdn.test/image.png',
  metadata: {dimensions: {width: 100, height: 100}, isOpaque: true}
} as ImageAsset

describe('imageDprUrl', () => {
  const dpr = window.devicePixelRatio

  afterEach(() => {
    Object.defineProperty(window, 'devicePixelRatio', {value: dpr, configurable: true})
  })

  it('scales width by devicePixelRatio and sets fit=max', () => {
    Object.defineProperty(window, 'devicePixelRatio', {value: 2, configurable: true})
    const url = imageDprUrl(asset, {width: 400})
    expect(url).toBe('https://cdn.test/image.png?fit=max&w=800')
  })

  it('includes height when provided, scaled by dpr', () => {
    Object.defineProperty(window, 'devicePixelRatio', {value: 2, configurable: true})
    const url = imageDprUrl(asset, {width: 300, height: 200})
    expect(url).toBe('https://cdn.test/image.png?fit=max&w=600&h=400')
  })

  it('uses multiplier 1 when devicePixelRatio is missing', () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      value: undefined as unknown as number,
      configurable: true
    })
    const url = imageDprUrl(asset, {width: 100})
    expect(url).toBe('https://cdn.test/image.png?fit=max&w=100')
  })
})
