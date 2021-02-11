import {hues} from '@sanity/color'
import {Box, Text} from '@sanity/ui'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectTags} from '../../modules/tags'
import PanelHeader from '../PanelHeader'
import TagPanel from '../TagPanel'

const TagsAll: FC = () => {
  const tags = useTypedSelector(state => selectTags(state))
  const fetching = useTypedSelector(state => state.tags.fetching)

  return (
    <Box>
      <PanelHeader allowCreate title="All tags" />

      {/* No tags */}
      {!fetching && tags && tags.length === 0 && (
        <Box padding={3}>
          <Text size={1} style={{color: hues.gray[700].hex}}>
            <em>No tags</em>
          </Text>
        </Box>
      )}

      <TagPanel actions={['delete', 'edit', 'search']} tags={tags} />
    </Box>
  )
}

export default TagsAll
