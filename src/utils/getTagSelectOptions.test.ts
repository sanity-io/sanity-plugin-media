import {describe, expect, it} from 'vitest'
import getTagSelectOptions from './getTagSelectOptions'
import type {Tag, TagItem} from '../types'

function tagItem(partial: Partial<TagItem> & Pick<TagItem, 'tag'>): TagItem {
  return {
    _type: 'tag',
    picked: false,
    updating: false,
    ...partial
  }
}

const makeTag = (id: string, name: string): Tag => ({
  _id: id,
  _type: 'media.tag',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r1',
  name: {_type: 'slug', current: name}
})

describe('getTagSelectOptions', () => {
  it('maps tag items to label/value options', () => {
    const tags = [tagItem({tag: makeTag('t1', 'alpha')}), tagItem({tag: makeTag('t2', 'beta')})]
    expect(getTagSelectOptions(tags)).toEqual([
      {label: 'alpha', value: 't1'},
      {label: 'beta', value: 't2'}
    ])
  })

  it('returns an empty array for an empty list', () => {
    expect(getTagSelectOptions([])).toEqual([])
  })

  it('skips items without a tag', () => {
    const tags = [
      tagItem({tag: makeTag('t1', 'ok')}),
      {_type: 'tag', tag: undefined, picked: false, updating: false} as unknown as TagItem
    ]
    expect(getTagSelectOptions(tags)).toEqual([{label: 'ok', value: 't1'}])
  })
})
