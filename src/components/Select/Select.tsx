import React, {ChangeEvent} from 'react'
import styled from 'styled-components'

import FormInput from '../../styled/FormInput'
import {BoxProps, SelectItem} from '../../types'

type Props = BoxProps & {
  disabled?: boolean
  items: SelectItem[]
  onChange: (item: SelectItem) => void
}

const StyledFormInput = styled(FormInput)`
  background-image: url("data:image/svg+xml;utf8,<svg width='9' viewBox='0 0 7 4' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3.90332 3.91211C4.02295 3.90869 4.13232 3.86426 4.22119 3.76855L6.81885 1.10938C6.89404 1.03418 6.93506 0.938477 6.93506 0.825684C6.93506 0.600098 6.75732 0.418945 6.53174 0.418945C6.42236 0.418945 6.31641 0.463379 6.23779 0.541992L3.90674 2.93799L1.56885 0.541992C1.49023 0.466797 1.3877 0.418945 1.2749 0.418945C1.04932 0.418945 0.871582 0.600098 0.871582 0.825684C0.871582 0.938477 0.912598 1.03418 0.987793 1.10938L3.58887 3.76855C3.68115 3.86426 3.78369 3.91211 3.90332 3.91211Z' fill='gray'/></svg>");
  background-repeat: no-repeat;
  background-position: center right ${props => props.theme.space[2]};
  transition: background-color 250ms;
`

const Select = (props: Props) => {
  const {disabled, items, onChange, ...boxProps} = props

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.selectedIndex
    onChange(items[selectedIndex])
  }

  return (
    <StyledFormInput
      as="select"
      disabled={disabled}
      onChange={handleChange}
      pr="24px"
      userSelect="none"
      {...boxProps}
    >
      {items.map((item, index) => {
        return (
          <option key={index} value={item.value}>
            {item.title}
          </option>
        )
      })}
    </StyledFormInput>
  )
}

export default Select
