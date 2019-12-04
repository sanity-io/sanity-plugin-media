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
    gridColumnGap: {
      property: 'gridColumnGap',
      scale: 'space'
    },
    gridGap: {
      property: 'gridGap',
      scale: 'space'
    },
    gridRowGap: {
      property: 'gridRowGap',
      scale: 'space'
    },
    gridRowEnd: true,
    gridRowStart: true,
    gridTemplateColumns: {
      property: 'gridTemplateColumns',
      scale: 'gridTemplateColumns'
    },
    overflowY: true,
    pointerEvents: true,
    textOverflow: true,
    textTransform: true,
    transform: true,
    transition: true,
    userSelect: true,
    whiteSpace: true
  })}
`

export default Box
