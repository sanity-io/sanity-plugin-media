import {BoxProps} from '@types'
import React from 'react'
import styled from 'styled-components'

import Box from '../../styled/Box'

type Props = BoxProps & {}

const Container = styled(Box)`
  display: block;
  animation: rotate 2s linear infinite;

  & .path {
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`

const Spinner = (props: Props) => {
  const {...boxProps} = props

  return (
    <Container as="svg" viewBox="0 0 50 50" width={props.width || '20px'} {...boxProps}>
      <g stroke="white">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="2" />
      </g>
    </Container>
  )
}

export default Spinner
