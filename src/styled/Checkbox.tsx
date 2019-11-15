import css from '@styled-system/css'
import {space, SpaceProps} from 'styled-system'
import styled from 'styled-components'

type Props = SpaceProps & {}

const Checkbox = styled.input.attrs(() => ({
  type: 'checkbox'
}))<Props>`
  appearance: none;
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid;
  opacity: 0.75;
  cursor: pointer;

  ${css({
    borderColor: 'gray'
  })}

  &:disabled {
    opacity: 0.25;
  }

  &:focus {
    outline: none;
  }

  @media (hover: hover) {
    &:hover {
      opacity: 1;
    }
  }

  :checked {
    opacity: 1;
    ${css({
      bg: 'white',
      borderColor: 'white'
    })}
  }

  ${space};
`

export default Checkbox
