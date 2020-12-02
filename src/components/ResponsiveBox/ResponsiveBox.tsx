import {BoxProps} from '@types'
import React, {ReactNode} from 'react'
import styled from 'styled-components'
import {system} from 'styled-system'

import Box from '../../styled/Box'

type Props = BoxProps & {
  aspectRatio: number | number[]
  children: ReactNode
  onClick?: Function // TODO: revise type
}

const Container = styled(Box)<{aspectRatio: number | number[]}>`
  ${system({
    aspectRatio: {
      property: 'paddingBottom',
      transform: val => `${100 / val}%`
    }
  })}
`

const ResponsiveBox = (props: Props) => {
  const {aspectRatio, children, onClick, ...boxProps} = props

  return (
    <Container
      aspectRatio={aspectRatio} //
      height={0}
      onClick={onClick}
      position="relative"
      width="100%"
      {...boxProps}
    >
      <Box position="absolute" size="100%">
        {children}
      </Box>
    </Container>
  )
}

export default ResponsiveBox
