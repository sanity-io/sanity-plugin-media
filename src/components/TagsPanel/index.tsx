import {Box} from '@sanity/ui'

import {TAGS_PANEL_WIDTH} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import TagView from '../TagView'

const TagsPanel = () => {
  const tagsPanelVisible = useTypedSelector(state => state.tags.panelVisible)

  if (!tagsPanelVisible) {
    return null
  }

  return (
    <Box
      style={{
        position: 'relative',
        width: TAGS_PANEL_WIDTH
      }}
    >
      <Box
        className="media__custom-scrollbar"
        style={{
          borderLeft: '1px solid var(--card-border-color)',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'absolute',
          right: 0,
          top: 0,
          width: '100%'
        }}
      >
        <TagView />
      </Box>
    </Box>
  )
}

export default TagsPanel
