import {Box} from '@sanity/ui'
import React from 'react'
import {TAGS_PANEL_WIDTH} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import CollaborationView from '../CollaborationView'

const CollaborationsPanel = () => {
  const collaborationsPanelVisible = useTypedSelector(state => state.collaborations.panelVisible)

  if (!collaborationsPanelVisible) {
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
        <CollaborationView />
      </Box>
    </Box>
  )
}

export default CollaborationsPanel
