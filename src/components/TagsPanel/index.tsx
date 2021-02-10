import {hues} from '@sanity/color'
import {Box} from '@sanity/ui'
import React, {FC} from 'react'

import {TAGS_PANEL_WIDTH} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'

import Tags from '../Tags'

const TagsPanel: FC = () => {
  const tagsPanelVisible = useTypedSelector(state => state.tags.panelVisible)

  if (!tagsPanelVisible) {
    return null
  }

  return (
    <Box
      className="media__custom-scrollbar"
      style={{
        borderLeft: `1px solid ${hues.gray?.[900].hex}`,
        height: '100%',
        overflowY: 'auto',
        position: 'absolute',
        right: 0,
        top: 0,
        width: TAGS_PANEL_WIDTH
      }}
    >
      <Tags />
    </Box>
  )
}

export default TagsPanel
