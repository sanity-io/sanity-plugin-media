import styled from 'styled-components'

import Box from './Box'

const FormInput = styled(Box)`
  appearance: none;
  background: transparent;
  border-style: solid;
  border-width: 1px;
  outline: none;
  transition: 250ms all;

  @media (hover: hover) and (pointer: fine) {
    &:hover:enabled:not(:focus) {
      background-color: rgba(255, 255, 255, 0.02);
    }
  }

  &:focus {
    border-color: ${props => props.theme.colors.gray};
  }

  &:disabled {
  }

  ::placeholder {
    color: ${props => props.theme.colors.gray};
  }

  ::selection {
    background: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.white};
  }
`

FormInput.defaultProps = {
  borderColor: 'darkGray',
  borderRadius: '2px',
  fontSize: 1,
  lineHeight: 1.5,
  py: '6px',
  pl: 2,
  pr: 2,
  textColor: 'lightGray'
}

export default FormInput
