import {Box} from '@sanity/ui'
import React from 'react'
import {Controller, FieldError} from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import useTypedSelector from '../../hooks/useTypedSelector'
import {reactSelectComponents, reactSelectStyles} from '../../styled/react-select/creatable'
import type {ReactSelectOption} from '../../types'
import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  control: any
  description?: string
  disabled?: boolean
  error?: FieldError
  label: string
  name: string
  onCreateTag: (tagName: string) => void
  options: {
    label: string
    value: string
  }[]
  placeholder?: string
  value?: ReactSelectOption[] | null
}

const FormFieldInputTags = (props: Props) => {
  const {
    control,
    description,
    disabled,
    error,
    label,
    name,
    onCreateTag,
    options,
    placeholder,
    value
  } = props

  // Redux
  const creating = useTypedSelector(state => state.tags.creating)
  const tagsFetching = useTypedSelector(state => state.tags.fetching)

  return (
    <Box
      // HACK: force stacking context to ensure react-select dropdown sits above other fields
      style={{zIndex: 2}}
    >
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      {/* Select */}
      <Controller
        control={control}
        defaultValue={value}
        name={name}
        render={({onBlur, onChange, value: controllerValue}) => {
          // TODO: investigate overriding `onChange` and updating form state manually.
          // `opt.media.tags` is initialised with `null` as a defaultValue in react-hook-form
          // Ideally, we'd be able to set `opt.media.tags` as null when all items are cleared, rather than
          // setting it to an empty array (which is currently causing false positives in denoting whether the form is dirty)
          //
          // To illustrate this issue:
          // - Edit an asset with no tags
          // - Add a new tag (either an existing one, or create one inline)
          // - Remove the tag you've just created
          //
          // At this point, the form will still be marked as dirty when it shouldnt be
          return (
            <CreatableSelect
              components={reactSelectComponents}
              instanceId="tags"
              isClearable={false} // TODO: re-enable when we're able to correctly (manually) re-validate on clear
              isDisabled={creating || disabled || tagsFetching}
              isLoading={creating}
              isMulti
              name={name}
              noOptionsMessage={() => 'No tags'}
              onBlur={onBlur}
              onChange={onChange}
              onCreateOption={onCreateTag}
              options={options}
              placeholder={tagsFetching ? 'Loading...' : placeholder}
              styles={reactSelectStyles}
              value={controllerValue}
            />
          )
        }}
      />
    </Box>
  )
}

export default FormFieldInputTags
