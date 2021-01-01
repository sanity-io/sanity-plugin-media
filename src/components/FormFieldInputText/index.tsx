import {Box, TextInput} from '@sanity/ui'
import React, {forwardRef} from 'react'
import {FieldError} from 'react-hook-form'

import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  description?: string
  disabled?: boolean
  error?: FieldError
  label: string
  name: string
  placeholder?: string
  tabIndex?: number
  value?: string
}

type Ref = HTMLInputElement

const FormFieldInputText = forwardRef<Ref, Props>((props: Props, ref) => {
  const {description, disabled, error, label, name, placeholder, tabIndex, value} = props

  return (
    <Box>
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      {/* Input */}
      <TextInput
        autoComplete="off"
        autoFocus={true}
        defaultValue={value}
        disabled={disabled}
        id={name}
        name={name}
        placeholder={placeholder}
        ref={ref}
      />
    </Box>
  )
})

export default FormFieldInputText
