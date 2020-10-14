import React, {ChangeEvent} from 'react'
import {
  // IoIosClose,
  IoIosSearch
} from 'react-icons/io'

import Box from '../../styled/Box'
import FormInput from '../../styled/FormInput'
import {BoxProps} from '../../types'

type Props = BoxProps & {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  value?: string
}

const SearchInput = (props: Props) => {
  const {onChange, placeholder, value, ...boxProps} = props

  return (
    <Box alignItems="center" display="flex" position="relative" {...boxProps}>
      {/* Search icon */}
      <Box left={0} position="absolute" pointerEvents="none" px="9px" textColor="lighterGray">
        <IoIosSearch size={16} />
      </Box>

      <FormInput
        as="input"
        maxWidth="240px"
        onChange={onChange}
        placeholder={placeholder}
        pl="32px"
        // pr="32px"
        type="text"
        width="100%"
        value={value}
      />

      {/* Clear form button */}
      {/*
      <Box alignItems="center" display="flex" height="100%" position="absolute" px="5px" right={0}>
        <IoIosClose size={18} style={{display: 'block'}} />
      </Box>
      */}
    </Box>
  )
}

export default SearchInput
