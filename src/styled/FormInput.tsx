import styled from 'styled-components'

import Box from './Box'

const FormInput = styled(Box)`
  background: transparent;
  border-style: solid;
  border-width: 1px;
  height: 34px;
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
`

FormInput.defaultProps = {
  borderColor: 'darkGray',
  borderRadius: '2px',
  pl: 2,
  pr: 2,
  textColor: 'lightGray'
}

export default FormInput
