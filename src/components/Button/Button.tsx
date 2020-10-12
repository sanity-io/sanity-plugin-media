import {rgba} from 'polished'
import React, {MouseEvent, ReactElement, ReactNode} from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'

import Box from '../../styled/Box'
import {BoxProps} from '../../types'

type Variant = 'danger' | 'default' | 'secondary'

type Props = BoxProps & {
  children?: ReactNode
  disabled?: boolean
  icon?: ReactElement
  onClick?: (e: MouseEvent) => void
  variant?: Variant
}

const Container = styled(Box)<{variant: Variant}>`
  transition: background 250ms;

  ${props =>
    variant({
      variants: {
        danger: {
          '--bg': rgba(props.theme.colors?.red, 0.1),
          '--text-color': props.theme.colors?.red
        },
        default: {
          '--bg': rgba(props.theme.colors?.white, 0.04),
          '--text-color': props.theme.colors?.white
        },
        secondary: {
          '--bg': rgba(props.theme.colors?.white, 0.04),
          '--text-color': props.theme.colors?.gray
        }
      }
    })}

  color: var(--text-color);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: var(--bg);
    }
  }

  svg {
    display: block;
    fill: currentColor;
  }
`

const Button = (props: Props) => {
  const {children, disabled, icon, onClick, variant = 'default', ...boxProps} = props

  return (
    <Container
      alignItems="center"
      as="button"
      bg="transparent"
      border="none"
      cursor={disabled ? 'default' : 'pointer'}
      display="flex"
      height="50px"
      justifyContent="center"
      onClick={onClick}
      outline="none"
      p={0}
      variant={variant}
      {...boxProps}
    >
      {/* Icon */}
      {icon && (
        <Box
          alignItems="center"
          // border="1px solid lime"
          size="50px"
          display="flex"
          justifyContent="center"
        >
          {icon}
        </Box>
      )}

      {children && (
        <Box pl={icon ? 2 : 3} pr={3}>
          {children}
        </Box>
      )}
    </Container>
  )
}

export default Button
