import {black, hues} from '@sanity/color'
import {Box, Flex, Text} from '@sanity/ui'
import React from 'react'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPickedLength} from '../../modules/assets'
import {selectTags} from '../../modules/tags'
import TagsVirtualized from '../TagsVirtualized'
import TagViewHeader from '../TagViewHeader'

const TagView = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength)
  const tags = useTypedSelector(selectTags)
  const fetching = useTypedSelector(state => state.tags.fetching)
  const fetchCount = useTypedSelector(state => state.tags.fetchCount)
  const fetchComplete = fetchCount !== -1
  const hasTags = !fetching && tags?.length > 0
  const hasPicked = !!(numPickedAssets > 0)

  return (
    <Flex
      direction="column"
      flex={1}
      style={{
        // background: hues.gray[950].hex,
        background: black.hex,
        height: '100%'
      }}
    >
      <TagViewHeader
        allowCreate //
        light={hasPicked}
        title={hasPicked ? 'Tags (in selection)' : 'Tags'}
      />

      {fetchComplete && !hasTags && (
        <Box padding={3}>
          <Text size={1} style={{color: hues.gray[700].hex}}>
            <em>No tags</em>
          </Text>
        </Box>
      )}

      {hasTags && <TagsVirtualized />}
    </Flex>
  )
}

export default TagView
