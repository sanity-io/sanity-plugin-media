import React from 'react'

import Box from '../../styled/Box'
import Flex from '../../styled/Flex'
import {BoxProps} from '../../types'

type Props = BoxProps & {
  title: string
  type?: string
}

const Label = (props: Props) => {
  const {title, type, ...boxProps} = props

  return (
    <Flex
      alignItems="center"
      bg="darkerGray"
      borderRadius="2px"
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
    </Flex>
  )
}

export default Label
