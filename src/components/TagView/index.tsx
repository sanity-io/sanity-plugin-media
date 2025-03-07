import {Box, Flex, Text} from '@sanity/ui'

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
    <Flex direction="column" flex={1} height="fill">
      <TagViewHeader
        allowCreate
        light={hasPicked}
        title={hasPicked ? 'Tags (in selection)' : 'Tags'}
      />

      {fetchComplete && !hasTags && (
        <Box padding={3}>
          <Text muted size={1}>
            <em>No tags</em>
          </Text>
        </Box>
      )}

      {hasTags && <TagsVirtualized />}
    </Flex>
  )
}

export default TagView
