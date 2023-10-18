import {Box} from '@sanity/ui'
import React from 'react'
import {Controller} from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import {useColorSchemeValue} from 'sanity'
import useTypedSelector from '../../hooks/useTypedSelector'
import {reactSelectComponents, reactSelectStyles} from '../../styled/react-select/creatable'
import type {TagSelectOption} from '../../types'
import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  control: any
  description?: string
  disabled?: boolean
  error?: string
  label: string
  name: string
  onCreateSeason: (tagName: string) => void
  options: {
    label: string
    value: string
  }[]
  placeholder?: string
  value?: TagSelectOption | null
}

const FormFieldInputCollaborations = (props: Props) => {
  const {
    control,
    description,
    disabled,
    error,
    label,
    name,
    onCreateSeason,
    options,
    placeholder,
    value
  } = props

  const scheme = useColorSchemeValue()

  // Redux
  const creating = useTypedSelector(state => state.collaborations.creating)
  const collaborationsFetching = useTypedSelector(state => state.collaborations.fetching)

  return (
    <Box
      // HACK: force stacking context to ensure react-select dropdown sits above other fields
      style={{zIndex: 12}}
    >
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      {/* Select */}
      <Controller
        control={control}
        defaultValue={value}
        name={name}
        render={({field}) => {
          const {onBlur, onChange, value: controllerValue} = field
          return (
            <CreatableSelect
              components={reactSelectComponents}
              instanceId="seasons"
              isClearable
              isDisabled={creating || disabled || collaborationsFetching}
              isLoading={creating}
              isMulti={false}
              name={name}
              noOptionsMessage={() => 'No Collaborations'}
              onBlur={onBlur}
              onChange={onChange}
              onCreateOption={onCreateSeason}
              options={options}
              placeholder={collaborationsFetching ? 'Loading...' : placeholder}
              styles={reactSelectStyles(scheme)}
              value={controllerValue}
            />
          )
        }}
      />
    </Box>
  )
}

export default FormFieldInputCollaborations
