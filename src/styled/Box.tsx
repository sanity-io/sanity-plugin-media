import {
  border,
  color,
  flexbox,
  grid,
  layout,
  position,
  space,
  system,
  typography
} from 'styled-system'
import styled from 'styled-components'
import {BoxProps} from '../types'

const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  ${border};
  ${color};
  ${flexbox};
  ${grid};
  ${layout};
  ${position};
  ${space};
  ${typography};

  ${system({
    boxShadow: true,
    boxSizing: true,
    cursor: true,
    overflowY: true,
    pointerEvents: true,
    textOverflow: true,
    transform: true,
    transition: true,
    userSelect: true,
    whiteSpace: true
  })}
`

export default Box
