import {Box} from '@sanity/ui'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectTags} from '../../modules/tags'
import PanelHeader from '../PanelHeader'
import TagPanel from '../TagPanel'

const TagsAll: FC = () => {
  const tags = useTypedSelector(state => selectTags(state))

  return (
    <Box>
      <PanelHeader allowCreate title="All tags" />
      <TagPanel actions={['delete', 'edit', 'search']} tags={tags} />
    </Box>
  )
}

export default TagsAll
