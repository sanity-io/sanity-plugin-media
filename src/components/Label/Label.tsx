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
      overflow="hidden"
      px={2}
      py={1}
      textColor="lighterGray"
      textOverflow="ellipsis"
    >
      <Box fontSize={0} mr={2} textColor="lightGray" textTransform="uppercase">
        {type}
      </Box>

      {title}
    </Box>
  )
}

export default Label
