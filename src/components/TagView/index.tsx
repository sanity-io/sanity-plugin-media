import {Box, Flex, Text} from '@sanity/ui'
import {TAG_DOCUMENT_NAME} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPickedLength} from '../../modules/assets'
import {selectTags} from '../../modules/tags'
import TagsVirtualized from '../TagsVirtualized'
import TagViewHeader from '../TagViewHeader'

const TagView = () => {
  const panelType = useTypedSelector(state => state.tags.panelType)
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength)
  let tags = useTypedSelector(selectTags)
  tags = tags.filter(tag => tag.tag._type === panelType)

  const fetching = useTypedSelector(state => state.tags.fetching)
  const fetchCount = useTypedSelector(state => state.tags.fetchCount)
  const fetchComplete = fetchCount !== -1
  const hasTags = !fetching && tags?.length > 0
  const hasPicked = !!(numPickedAssets > 0)

  const title = panelType === TAG_DOCUMENT_NAME ? 'Tags' : 'Projects'

  return (
    <Flex direction="column" flex={1} height="fill">
      <TagViewHeader
        allowCreate
        light={hasPicked}
        title={hasPicked ? `${title} (in selection)` : title}
      />

      {fetchComplete && !hasTags && (
        <Box padding={3}>
          <Text muted size={1}>
            <em>No {title.toLowerCase()}</em>
          </Text>
        </Box>
      )}

      {hasTags && <TagsVirtualized />}
    </Flex>
  )
}

export default TagView
