import {hues} from '@sanity/color'
import {Box, Text} from '@sanity/ui'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {selectTags} from '../../modules/tags'
import PanelHeader from '../PanelHeader'
import TagPanel from '../TagPanel'

const TagsPicked: FC = () => {
  const assetsPicked = useTypedSelector(selectAssetsPicked)
  const tags = useTypedSelector(selectTags)
  const fetching = useTypedSelector(state => state.tags.fetching)

  // TODO: refactor, there's most certainly a more performant way to do this

  const pickedTagIds = assetsPicked?.reduce((acc: string[], val) => {
    const assetTagIds = val?.asset?.opt?.media?.tags?.map(tag => tag._ref) || []
    acc = acc.concat(assetTagIds)
    return acc
  }, [])

  // Filter out all tag IDS used (across all)
  const pickedTagIdsUnique = pickedTagIds?.filter(
    (tag, index) => pickedTagIds.indexOf(tag) === index
  )

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

  const tagsAppliedToAll = tags.filter(tag => tagIdsSegmented.appliedToAll.includes(tag.tag._id))
  const tagsAppliedToSome = tags.filter(tag => tagIdsSegmented.appliedToSome.includes(tag.tag._id))
  const tagsUnused = tags.filter(tag => !pickedTagIdsUnique.includes(tag.tag._id))

  return (
    <Box>
      <PanelHeader allowCreate light title="Tags (in selection)" />

      {/* No tags */}
      {!fetching && tags && tags.length === 0 && (
        <Box padding={3}>
          <Text size={1} style={{color: hues.gray[700].hex}}>
            <em>No tags</em>
          </Text>
        </Box>
      )}

      {tagsAppliedToAll?.length > 0 && (
        <TagPanel
          actions={['delete', 'edit', 'removeAll', 'search']}
          tags={tagsAppliedToAll}
          title="Used by all"
        />
      )}
      {tagsAppliedToSome?.length > 0 && (
        <TagPanel
          actions={['applyAll', 'delete', 'edit', 'removeAll', 'search']}
          tags={tagsAppliedToSome}
          title="Used by some"
        />
      )}
      {tagsUnused?.length > 0 && (
        <TagPanel
          actions={['applyAll', 'edit', 'delete', 'search']}
          tags={tagsUnused}
          title="Unused"
        />
      )}
    </Box>
  )
}

export default TagsPicked
