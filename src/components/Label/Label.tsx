import React from 'react'

import Box from '../../styled/Box'

type Props = {
  title: string
  type?: string
}

const Label = (props: Props) => {
  const {title, type} = props

  return (
    <Box
      alignItems="center"
      bg="darkGray"
      borderRadius="2px"
      display="flex"
      fontSize={1}
      fontWeight={500}
      maxWidth="500px"
      mx={2}
      px={2}
      py={1}
      textColor="lighterGray"
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
