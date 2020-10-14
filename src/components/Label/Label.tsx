import React from 'react'

import Box from '../../styled/Box'
import {BoxProps} from '../../types'

type Props = BoxProps & {
  title: string
  type?: string
}

const Label = (props: Props) => {
  const {title, type, ...boxProps} = props

  return (
    <Box
      alignItems="center"
      bg="darkGray"
      borderRadius="2px"
      display="flex"
      fontSize={1}
      fontWeight={500}
      mx={2}
      px={2}
      py={1}
      textColor="lighterGray"
      {...boxProps}
    >
      <Box fontSize={0} mr={2} textColor="lightGray" textTransform="uppercase">
        {type}
      </Box>

      <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {title}
      </Box>
    </Box>
  )
}

export default Label
