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
      bg="darkerGray"
      borderRadius="2px"
      display="flex"
      mx={2}
      px={2}
      py={1}
      textColor="lighterGray"
      {...boxProps}
    >
      <Box
        fontSize={0}
        fontWeight={500}
        lineHeight="1em"
        mr={1}
        textColor="lightGray"
        textTransform="uppercase"
      >
        {type}
      </Box>

      <Box
        fontSize={1}
        overflow="hidden"
        lineHeight="1em"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {title}
      </Box>
    </Box>
  )
}

export default Label
