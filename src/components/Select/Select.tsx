import {rgba} from 'polished'
import React, {ChangeEvent} from 'react'
import styled from 'styled-components'

import Box from '../../styled/Box'
import {BoxProps} from '../../types'

type Props = BoxProps & {
  bleed?: boolean
  disabled?: boolean
  items: {
    title: string
    value: string
  }[]
  onChange: (value: string) => void
}

const Container = styled(Box)`
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg width='9' viewBox='0 0 7 4' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3.90332 3.91211C4.02295 3.90869 4.13232 3.86426 4.22119 3.76855L6.81885 1.10938C6.89404 1.03418 6.93506 0.938477 6.93506 0.825684C6.93506 0.600098 6.75732 0.418945 6.53174 0.418945C6.42236 0.418945 6.31641 0.463379 6.23779 0.541992L3.90674 2.93799L1.56885 0.541992C1.49023 0.466797 1.3877 0.418945 1.2749 0.418945C1.04932 0.418945 0.871582 0.600098 0.871582 0.825684C0.871582 0.938477 0.912598 1.03418 0.987793 1.10938L3.58887 3.76855C3.68115 3.86426 3.78369 3.91211 3.90332 3.91211Z' fill='gray'/></svg>");
  background-repeat: no-repeat;
  background-position: center right ${props => props.theme.space[2]};
  transition: background-color 250ms;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${props => rgba(props.theme.colors?.white, 0.05)};
    }
  }
`

const Select = (props: Props) => {
  const {bleed, disabled, items, onChange, ...boxProps} = props

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onChange(value)
  }

  return (
    <Container
      alignItems="center"
      as="select"
      bg="transparent"
      border="none"
      cursor={disabled ? 'default' : 'pointer'}
      display="flex"
      height={bleed ? '100%' : 'auto'}
      justifyContent="center"
      onChange={handleChange}
      outline="none"
      pl={2}
      pr={4}
      py={2}
      textColor="lightGray"
      {...boxProps}
    >
      {items.map((item, index) => {
        return (
          <option key={index} value={item.value}>
            {item.title}
          </option>
        )
      })}
    </Container>
  )
}

export default Select
