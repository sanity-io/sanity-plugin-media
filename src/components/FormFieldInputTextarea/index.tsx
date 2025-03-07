import {Box, TextArea} from '@sanity/ui'
import {forwardRef} from 'react'

import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  description?: string
  disabled?: boolean
  error?: string
  label: string
  name: string
  placeholder?: string
  rows?: number
  value?: string
}

type Ref = HTMLTextAreaElement

const FormFieldInputTextarea = forwardRef<Ref, Props>((props: Props, ref) => {
  const {description, disabled, error, label, name, placeholder, rows, value, ...rest} = props

  return (
    <Box>
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      {/* Input */}
      <TextArea
        {...rest}
        autoComplete="off"
        defaultValue={value}
        disabled={disabled}
        id={name}
        name={name}
        placeholder={placeholder}
        ref={ref}
        rows={rows}
      />
    </Box>
  )
})

export default FormFieldInputTextarea
