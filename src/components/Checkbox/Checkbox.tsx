import {BoxProps} from '@types'
import React from 'react'
import {IoIosCheckmarkCircle, IoIosRadioButtonOff} from 'react-icons/io'
import styled from 'styled-components'

import Flex from '../../styled/Flex'

type Props = BoxProps & {
  checked?: boolean
  onClick?: Function // TODO: revise type
}

const Container = styled(Flex)`
  transition: opacity 200ms;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 1;
    }
  }

  svg {
    display: block;
    fill: currentColor;
  }
`

const Checkbox = (props: Props) => {
  const {checked, onClick, ...boxProps} = props

  return (
    <Container
      alignItems="center"
      cursor="pointer"
      onClick={onClick}
      justifyContent="center"
      opacity={checked ? 1 : 0.4}
      p={1}
      textColor="white"
      {...boxProps}
    >
      {checked ? <IoIosCheckmarkCircle size={20} /> : <IoIosRadioButtonOff size={20} />}
    </Container>
  )
}

export default Checkbox
