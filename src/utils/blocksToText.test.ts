import {describe, expect, it} from 'vitest'
import blocksToText from './blocksToText'
import type {Block} from '../types'

describe('blocksToText', () => {
  it('returns plain strings unchanged', () => {
    expect(blocksToText('hello')).toBe('hello')
    expect(blocksToText('')).toBe('')
  })

  it('returns empty string for non-array non-string input', () => {
    expect(blocksToText(null as unknown as string)).toBe('')
  })

  it('joins block children text with blank lines between blocks', () => {
    const blocks: Block[] = [
      {
        _type: 'block',
        _key: 'a',
        markDefs: [],
        children: [{_key: 'a1', text: 'Line one', marks: []}]
      },
      {
        _type: 'block',
        _key: 'b',
        markDefs: [],
        children: [{_key: 'b1', text: 'Line two', marks: []}]
      }
    ]
    expect(blocksToText(blocks)).toBe('Line one\n\nLine two')
  })

  it('removes non-block nodes by default', () => {
    const blocks = [{_type: 'image', _key: 'i', markDefs: [], children: []}] as unknown as Block[]
    expect(blocksToText(blocks)).toBe('')
  })

  it('keeps placeholder for non-block nodes when nonTextBehavior is not remove', () => {
    const blocks = [{_type: 'image', _key: 'i', markDefs: [], children: []}] as unknown as Block[]
    expect(blocksToText(blocks, {nonTextBehavior: 'keep'})).toBe('[image block]')
  })
})
