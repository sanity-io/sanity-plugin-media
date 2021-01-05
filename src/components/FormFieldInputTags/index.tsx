import {AddIcon, ChevronDownIcon, CloseIcon} from '@sanity/icons'
import {Box, Card, Flex, Text, studioTheme} from '@sanity/ui'
// import groq from 'groq'
// import client from 'part:@sanity/base/client'
import React, {forwardRef, useState} from 'react'
import {Controller, FieldError} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {components} from 'react-select'
import CreatableSelect from 'react-select/creatable'
// import AsyncCreatableSelect from 'react-select/async-creatable'

import useTypedSelector from '../../hooks/useTypedSelector'
import {tagsCreate} from '../../modules/tags'

import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  control: any
  description?: string
  disabled?: boolean
  error?: FieldError
  label: string
  name: string
  placeholder?: string
  value?: string
}

type Ref = HTMLInputElement

const themeDarkPrimaryBlue = studioTheme?.color?.dark?.primary?.spot?.blue
const themeDarkPrimaryGray = studioTheme?.color?.dark?.primary?.spot?.gray
const themeRadius = studioTheme?.radius
const themeSpace = studioTheme?.space

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

const FormFieldInputTags = forwardRef<Ref, Props>((props: Props, ref) => {
  const {control, description, disabled, error, label, name, placeholder, value} = props

  // State
  const [isCreating, setIsCreating] = useState(false)

  // Redux
  const dispatch = useDispatch()
  const allIds = useTypedSelector(state => state.tags.allIds)
  const byIds = useTypedSelector(state => state.tags.byIds)

  const selectTags = allIds.map(id => {
    const tag = byIds[id].tag

    return {
      label: tag.name,
      value: tag.name
    }
  })
  console.log('>>> selectTags', selectTags)

  // Callbacks
  const handleChange = (newValue: any, actionMeta: any) => {
    console.group('Value Changed')
    console.log(newValue)
    console.log(`action: ${actionMeta.action}`)
    console.groupEnd()
  }

  const handleCreate = (value: string) => {
    console.log('create....')
    console.log('value', value)
    setIsCreating(true)

    // TODO: dispatch action to create new tag
    dispatch(tagsCreate(value))

    // TODO: how do we determine if a tag has been successfully created?
  }

  return (
    <Box style={{zIndex: 9000}}>
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      {/* Select */}
      <Controller
        as={CreatableSelect}
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
        control={control}
        defaultOptions
        instanceId="tags"
        isClearable={false} // TODO: re-enable when we're able to correctly (manually) re-validate on clear
        isDisabled={isCreating || disabled}
        isMulti
        isLoading={isCreating}
        // menuPortalTarget={document.body}
        // menuPortalTarget={refContainer.current}
        name={name}
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={selectTags}
        placeholder={placeholder}
        styles={{
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
        }}
      />
    </Box>
  )
})

export default FormFieldInputTags
