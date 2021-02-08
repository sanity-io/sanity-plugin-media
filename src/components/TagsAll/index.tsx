import {ComposeIcon} from '@sanity/icons'
import {Box, Button, Label} from '@sanity/ui'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogShowTagCreate} from '../../modules/dialog'
import {selectTags} from '../../modules/tags'
import PanelHeader from '../PanelHeader'
import Tag from '../Tag'

const TagsAll: FC = () => {
  const tags = useTypedSelector(state => selectTags(state))

  // Redux
  const dispatch = useDispatch()
  const tagsCreating = useTypedSelector(state => state.tags.creating)

  // Callbacks
  const handleTagCreate = () => {
    dispatch(dialogShowTagCreate())
  }

  return (
    <Box>
      <PanelHeader>
        <Label size={0}>All Tags ({tags?.length})</Label>

        {/* Create new tag button */}
        <Button
          disabled={tagsCreating}
          fontSize={1} //
          icon={ComposeIcon}
          mode="bleed"
          onClick={handleTagCreate}
          style={{
            background: 'transparent',
            boxShadow: 'none'
          }}
          tone="primary"
        />
      </PanelHeader>

      <Box>
        {tags?.map(tag => (
          <Tag key={tag?.tag?._id} tag={tag} />
        ))}
      </Box>
    </Box>
  )
}

export default TagsAll
