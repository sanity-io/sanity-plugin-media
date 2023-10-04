import {Box, Select, Stack} from '@sanity/ui'
import FormFieldInputLabel from '../FormFieldInputLabel'
import React, {forwardRef} from 'react'

interface Props {
  options: Array<{id: string; name: string}>
  onSelect: (value: string) => void
  description?: string
  disabled?: boolean
  error?: string
  placeholder?: string
  value?: string
  label: string
  name: string
  initialValue?: string
}

type Ref = HTMLSelectElement

const FormFieldSelect = forwardRef<Ref, Props>((props: Props, ref) => {
  const {
    description,
    disabled,
    error,
    label,
    options = [],
    onSelect,
    name,
    initialValue,
    ...rest
  } = props
  const firstOption = options.find(option => option.id === initialValue)?.name || 'Select an option'
  return (
    <Box>
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />
      <Stack>
        <Select
          {...rest}
          disabled={disabled}
          onSelect={e => onSelect(e.currentTarget.value)}
          onChange={e => onSelect(e.currentTarget.value)}
          ref={ref}
        >
          <option>{firstOption}</option>
          {options.map(option => (
            <option value={option?.id} key={option?.id}>
              {option?.name}
            </option>
          ))}
        </Select>
      </Stack>
    </Box>
  )
})

export default FormFieldSelect
