import styled from 'styled-components'
import Box from './Box'

const IconButton = styled(Box)`
  svg {
    display: block;
  }

  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      opacity: 0.5;
    }
  }
`

export default IconButton
