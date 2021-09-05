import {Box, Flex, Label} from '@sanity/ui'
import React, {FC, memo} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import {areEqual, FixedSizeList, ListChildComponentProps} from 'react-window'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {selectTags} from '../../modules/tags'
import {TagActions, TagItem} from '../../types'
import Tag from '../Tag'

const VirtualRow = memo((props: ListChildComponentProps) => {
  const {data, index, style} = props
  const {items} = data
  const item = items[index]

  // Render label
  if (typeof item === 'string') {
    return (
      <Flex align="center" justify="space-between" key={item} paddingY={3} style={style}>
        <Label size={0}>{item}</Label>
      </Flex>
    )
  }

  // Render tag
  return (
    <Box key={item.tag?._id} style={style}>
      <Tag actions={item.actions} tag={item} />
    </Box>
  )
}, areEqual)

const Tags: FC = () => {
  const assetsPicked = useTypedSelector(selectAssetsPicked)
  const tags = useTypedSelector(selectTags)

  // TODO: refactor, there's most certainly a more performant way to do this

  // Filter out all tag IDS used (across all) and dedupe
  const pickedTagIds = assetsPicked?.reduce((acc: string[], val) => {
    const assetTagIds = val?.asset?.opt?.media?.tags?.map(tag => tag._ref) || []
    acc = acc.concat(assetTagIds)
    return acc
  }, [])
  const pickedTagIdsUnique = [...new Set(pickedTagIds)]

  // Segment tags into two buckets:
  // 1. those which exist in all picked assets ('applied to all')
  // 2. those which exist in some picked assets ('applied to some')
  const tagIdsSegmented = pickedTagIdsUnique.reduce(
    (acc: {appliedToAll: string[]; appliedToSome: string[]}, tagId) => {
      const tagIsInEveryAsset = assetsPicked.every(assetItem => {
        const tagIndex =
          assetItem.asset.opt?.media?.tags?.findIndex(tag => tag._ref === tagId) ?? -1
        if (tagIndex >= 0) {
          return true
        }
      })

      if (tagIsInEveryAsset) {
        acc.appliedToAll.push(tagId)
      } else {
        acc.appliedToSome.push(tagId)
      }

      return acc
    },
    {
      appliedToAll: [],
      appliedToSome: []
    }
  )

  const tagsAppliedToAll = tags
    .filter(tag => tagIdsSegmented.appliedToAll.includes(tag.tag._id))
    .map(tagItem => ({
      ...tagItem,
      actions: ['delete', 'edit', 'removeAll', 'search'] as TagActions[]
    }))
  const tagsAppliedToSome = tags
    .filter(tag => tagIdsSegmented.appliedToSome.includes(tag.tag._id))
    .map(tagItem => ({
      ...tagItem,
      actions: ['applyAll', 'delete', 'edit', 'removeAll', 'search'] as TagActions[]
    }))
  const tagsUnused = tags
    .filter(tag => !pickedTagIdsUnique.includes(tag.tag._id))
    .map(tagItem => ({
      ...tagItem,
      actions: ['applyAll', 'delete', 'edit', 'search'] as TagActions[]
    }))

  let items: (
    | string
    | (TagItem & {
        actions: TagActions[]
      })
  )[] = []
  if (assetsPicked.length === 0) {
    items = tags.map(tagItem => ({
      ...tagItem,
      actions: ['delete', 'edit', 'search'] as TagActions[]
    }))
  } else {
    if (tagsAppliedToAll?.length > 0) {
      items = [
        ...items, //
        assetsPicked.length === 1 ? 'Used' : 'Used by all',
        ...tagsAppliedToAll
      ]
    }
    if (tagsAppliedToSome?.length > 0) {
      items = [
        ...items, //
        'Used by some',
        ...tagsAppliedToSome
      ]
    }
    if (tagsUnused?.length > 0) {
      items = [
        ...items, //
        'Unused',
        ...tagsUnused
      ]
    }
  }

  const itemKey = (index: number) => {
    const item = items[index]
    if (typeof item === 'string') {
      return item
    }
    return item?.tag._id
  }

  return (
    <Box paddingX={3} style={{flex: 1}}>
      <AutoSizer>
        {({height, width}) => {
          return (
            <FixedSizeList
              className="media__custom-scrollbar"
              height={height}
              itemData={{items}}
              itemCount={items.length}
              itemKey={itemKey}
              itemSize={33} // px
              style={{
                position: 'relative',
                overflowX: 'hidden',
                overflowY: 'scroll'
              }}
              width={width}
            >
              {VirtualRow}
            </FixedSizeList>
          )
        }}
      </AutoSizer>
    </Box>
  )
}

export default Tags
