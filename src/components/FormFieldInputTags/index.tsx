import {AddIcon, ChevronDownIcon, CloseIcon} from '@sanity/icons'
import {Box, Card, Flex, Text, studioTheme} from '@sanity/ui'
import React, {FC} from 'react'
import {Controller, FieldError} from 'react-hook-form'
import {components} from 'react-select'
import CreatableSelect from 'react-select/creatable'

import useTypedSelector from '../../hooks/useTypedSelector'

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
  value?: {label: string; value: string}[]
}

const themeDarkPrimaryBlue = studioTheme?.color?.dark?.primary?.spot?.blue
const themeDarkPrimaryGray = studioTheme?.color?.dark?.primary?.spot?.gray
const themeRadius = studioTheme?.radius
const themeSpace = studioTheme?.space

const customSelectStyles = {
  control: (styles: any, {isDisabled}: {isDisabled: boolean}) => ({
    ...styles,
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: themeRadius[2],
    boxShadow: 'inset 0 0 0 1px #272a2e', // TODO: use theme value
    minHeight: '35px',
    opacity: isDisabled ? 0.5 : 'inherit',
    outline: 'none'
  }),
  input: (styles: any) => ({
    ...styles,
    color: 'white',
    marginLeft: themeSpace[2]
  }),
  multiValue: (styles: any) => ({
    ...styles,
    backgroundColor: themeDarkPrimaryGray,
    borderRadius: themeRadius[2]
  }),
  multiValueRemove: (styles: any) => ({
    ...styles,
    '&:hover': {
      background: 'transparent',
      color: 'inherit'
    }
  }),
  option: (styles: any, {isFocused}: {isFocused: boolean}) => ({
    ...styles,
    backgroundColor: isFocused ? themeDarkPrimaryBlue : 'transparent',
    borderRadius: themeRadius[2],
    color: isFocused ? '#1f2123' : 'inherit', // TODO: use theme value
    padding: '4px 6px', // TODO: use theme value
    '&:hover': {
      backgroundColor: themeDarkPrimaryBlue,
      color: '#1f2123' // TODO: use theme value
    }
  }),
  placeholder: (styles: any) => ({
    ...styles,
    marginLeft: themeSpace[2]
  }),
  valueContainer: (styles: any) => ({
    ...styles,
    marginBottom: themeSpace[1],
    marginLeft: themeSpace[1],
    marginTop: themeSpace[1],
    padding: 0
  })
}

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <Box paddingX={2}>
        <Text size={1}>
          <ChevronDownIcon />
        </Text>
      </Box>
    </components.DropdownIndicator>
  )
}

const Menu = (props: any) => {
  return (
    <components.Menu {...props}>
      <Card radius={1} scheme="dark" shadow={2}>
        {props.children}
      </Card>
    </components.Menu>
  )
}

const MenuList = (props: any) => {
  return <components.MenuList {...props}>{props.children}</components.MenuList>
}

const MultiValueLabel = (props: any) => {
  return (
    <Box paddingLeft={1} paddingRight={0} paddingY={1}>
      <Text weight="semibold" size={2}>
        <components.MultiValueLabel {...props} />
      </Text>
    </Box>
  )
}

const MultiValueRemove = (props: any) => {
  return (
    <components.MultiValueRemove {...props}>
      <CloseIcon color="#1f2123" />
    </components.MultiValueRemove>
  )
}

const Option = (props: any) => {
  return (
    <Box paddingX={2} paddingY={1}>
      <components.Option {...props}>
        <Flex align="center">
          {props.data.__isNew__ && <AddIcon style={{marginRight: '3px'}} />}
          {props.children}
        </Flex>
      </components.Option>
    </Box>
  )
}

const FormFieldInputTags: FC<Props> = (props: Props) => {
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

  return (
    <Box style={{zIndex: 9000}}>
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      {/* Select */}
      <Controller
        control={control}
        defaultValue={value}
        name={name}
        render={({onBlur, onChange, value: controllerValue}) => {
          return (
            <CreatableSelect
              cacheOptions={false}
              components={{
                DropdownIndicator,
                IndicatorSeparator: null,
                Menu,
                MenuList,
                MultiValueLabel,
                MultiValueRemove,
                Option
              }}
              defaultOptions
              instanceId="tags"
              isClearable={false} // TODO: re-enable when we're able to correctly (manually) re-validate on clear
              isDisabled={creating || disabled}
              isLoading={creating}
              isMulti
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              onCreateOption={onCreateTag}
              options={options}
              placeholder={placeholder}
              styles={customSelectStyles}
              value={controllerValue}
            />
          )
        }}
      />
    </Box>
  )
}

export default FormFieldInputTags
