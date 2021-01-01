import {Box, Flex, TextInput} from '@sanity/ui'
import React, {forwardRef} from 'react'
import {FieldError} from 'react-hook-form'

import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  description?: string
  extension: string
  disabled?: boolean
  error?: FieldError
  label: string
  name: string
  placeholder?: string
  suffix?: string
  value?: string
}

type Ref = HTMLInputElement

const FormFieldInputText = forwardRef<Ref, Props>((props: Props, ref) => {
  const {description, disabled, error, extension, label, name, placeholder, value} = props

  return (
    <Box>
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      {/* Input */}
      <Flex>
        <Box style={{flexGrow: 1}}>
          <TextInput
            autoComplete="off"
            autoFocus
            defaultValue={value}
            disabled={disabled}
            id={name}
            name={name}
            placeholder={placeholder}
            ref={ref}
          />
        </Box>
        <Box style={{width: '70px'}}>
          <TextInput defaultValue={`.${extension}`} disabled={true} />
        </Box>
      </Flex>
    </Box>
  )
})

export default FormFieldInputText
