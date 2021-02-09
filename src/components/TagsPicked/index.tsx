import {Box, Label} from '@sanity/ui'
import React, {FC} from 'react'
import PanelHeader from '../PanelHeader'

const TagsPicked: FC = () => {
  return (
    <Box>
      <PanelHeader>
        <Label size={0}>Tags [applied to all]</Label>
      </PanelHeader>

      <PanelHeader>
        <Label size={0}>Tags [applied to some]</Label>
      </PanelHeader>
    </Box>
  )
}

export default TagsPicked
