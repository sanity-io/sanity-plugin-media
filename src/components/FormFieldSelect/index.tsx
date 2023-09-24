import {Box, Select, Stack} from '@sanity/ui'
import FormFieldInputLabel from '../FormFieldInputLabel'
import React, {forwardRef} from 'react'

interface Props {
  options: Array<string>
  onSelect: (value: string) => void
  description?: string
  disabled?: boolean
  error?: string
  placeholder?: string
  value?: string
  label: string
  name: string
}

type Ref = HTMLSelectElement

const FormFieldSelect = forwardRef<Ref, Props>((props: Props, ref) => {
  const {description, disabled, error, label, options, value, onSelect, name, ...rest} = props
  return (
    <Box>
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />
      <Stack>
        <Select
          {...rest}
          disabled={disabled}
          onSelect={e => onSelect(e.currentTarget.value)}
          onChange={e => onSelect(e.currentTarget.value)}
          fontSize={[2, 2, 3, 4]}
          padding={[3, 3, 4]}
          space={[3, 3, 4]}
          value={value}
          ref={ref}
        >
          {options.map(option => (
            <option key={option}>{option}</option>
          ))}
        </Select>
      </Stack>
    </Box>
  )
})

export default FormFieldSelect
