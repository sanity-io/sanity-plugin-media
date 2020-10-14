import {rgba} from 'polished'
import React, {MouseEvent, ReactElement, ReactNode} from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'

import Box from '../../styled/Box'
import {BoxProps, ButtonVariant} from '../../types'

type Props = BoxProps & {
  children?: ReactNode
  disabled?: boolean
  icon?: ReactElement
  onClick?: (e: MouseEvent) => void
  variant?: ButtonVariant
}

const Container = styled(Box)<{variant: ButtonVariant}>`
  transition: background 250ms;

  ${props =>
    variant({
      variants: {
        danger: {
          '--bg': 'transparent',
          '--bg-hover': rgba(props.theme.colors?.red, 0.1),
          '--text-color': props.theme.colors?.red
        },
        default: {
          '--bg': 'transparent',
          '--bg-hover': rgba(props.theme.colors?.white, 0.04),
          '--text-color': props.theme.colors?.white
        },
        secondary: {
          '--bg': 'transparent',
          '--bg-hover': rgba(props.theme.colors?.white, 0.04),
          '--text-color': props.theme.colors?.gray
        }
      }
    })}

  background-color: var(--bg);
  color: var(--text-color);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--bg-hover);
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
      fontSize={1}
      height="headerRowHeight"
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
          display="flex"
          justifyContent="center"
          pl={children ? 3 : 0}
          width={children ? 'auto' : 'headerRowHeight'}
        >
          {icon}
        </Box>
      )}

      {children && (
        <Box alignItems="center" display="flex" pl={icon ? 1 : 3} pr={3}>
          <strong>{children}</strong>
        </Box>
      )}
    </Container>
  )
}

export default Button
