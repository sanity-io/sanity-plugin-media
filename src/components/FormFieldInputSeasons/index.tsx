import {Box} from '@sanity/ui'
import React from 'react'
import {Controller} from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import {useColorScheme} from 'sanity'
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

const FormFieldInputSeasons = (props: Props) => {
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

  const {scheme} = useColorScheme()

  // Redux
  const creating = useTypedSelector(state => state.seasons.creating)
  const seasonsFetching = useTypedSelector(state => state.seasons.fetching)

  return (
    <Box
      // HACK: force stacking context to ensure react-select dropdown sits above other fields
      style={{zIndex: 24}}
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
              instanceId="seasons"
              isClearable
              isDisabled={creating || disabled || seasonsFetching}
              isLoading={creating}
              isMulti={false}
              name={name}
              noOptionsMessage={() => 'No Seasons'}
              onBlur={onBlur}
              onChange={onChange}
              onCreateOption={onCreateSeason}
              options={options}
              placeholder={seasonsFetching ? 'Loading...' : placeholder}
              styles={reactSelectStyles(scheme)}
              value={controllerValue}
            />
          )
        }}
      />
    </Box>
  )
}

export default FormFieldInputSeasons
