import {Box} from '@sanity/ui'
import React from 'react'
import {TAGS_PANEL_WIDTH} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import SeasonView from '../SeasonView'

const SeasonsPanel = () => {
  const seasonsPanelVisible = useTypedSelector(state => state.seasons.panelVisible)

  if (!seasonsPanelVisible) {
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
        <SeasonView />
      </Box>
    </Box>
  )
}

export default SeasonsPanel
