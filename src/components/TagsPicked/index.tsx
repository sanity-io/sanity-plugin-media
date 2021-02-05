import {Box, Flex, Label} from '@sanity/ui'
import React, {FC} from 'react'

const SubHeader = () => {
  return (
    <Flex
      align="center"
      justify="space-between"
      paddingLeft={3}
      style={{
        background: '#0F1112', // TODO: use theme colors
        borderBottom: '1px solid #333', // TODO: use theme colors
        height: '2.0em',
        position: 'sticky',
        top: 0,
        zIndex: 1
      }}
    >
      <Label size={0}>Applied to some</Label>
    </Flex>
  )
}

const TagsPicked: FC = () => {
  return (
    <Box>
      <Flex
        align="center"
        justify="space-between"
        paddingLeft={3}
        style={{
          background: '#0F1112', // TODO: use theme colors
          borderBottom: '1px solid #333', // TODO: use theme colors
          height: '2.0em',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <Label size={0}>Applied to all</Label>
      </Flex>

      <SubHeader />
    </Box>
  )
}

export default TagsPicked
