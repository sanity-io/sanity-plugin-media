import {black, hues} from '@sanity/color'
import {AddIcon, ChevronDownIcon, CloseIcon} from '@sanity/icons'
import {Box, Card, Flex, Text, studioTheme} from '@sanity/ui'
import {components} from 'react-select'
import React, {CSSProperties} from 'react'

const themeDarkPrimaryBlue = studioTheme?.color?.dark?.primary?.spot?.blue
const themeDarkPrimaryGray = studioTheme?.color?.dark?.primary?.spot?.gray
const themeRadius = studioTheme?.radius
const themeSpace = studioTheme?.space

export const reactSelectStyles = {
  control: (
    styles: CSSProperties,
    {isDisabled, isFocused}: {isDisabled: boolean; isFocused: boolean}
  ) => {
    let boxShadow = `inset 0 0 0 1px ${hues.gray[900].hex}`
    if (isFocused) {
      boxShadow = `inset 0 0 0 1px ${hues.gray[900].hex}, 0 0 0 1px var(--card-bg-color), 0 0 0 3px var(--card-focus-ring-color) !important`
    }

    return {
      ...styles,
      background: isDisabled
        ? studioTheme.color.dark.default.input.default.disabled.bg
        : 'transparent',
      color: 'white',
      border: 'none',
      borderRadius: themeRadius[2],
      boxShadow,
      minHeight: '35px',
      outline: 'none',
      transition: 'none',
      '&:hover': {
        boxShadow: `inset 0 0 0 1px ${studioTheme.color.dark.default.input.default.hovered.border}`
      }
    }
  },
  indicatorsContainer: (styles: CSSProperties, {isDisabled}: {isDisabled: boolean}) => ({
    ...styles,
    opacity: isDisabled ? 0.25 : 1
  }),
  input: (styles: CSSProperties) => ({
    ...styles,
    color: 'white',
    marginLeft: themeSpace[2]
  }),
  menuList: (styles: CSSProperties) => ({
    ...styles,
    maxHeight: '230px'
  }),
  multiValue: (styles: CSSProperties, {isDisabled}: {isDisabled: boolean}) => ({
    ...styles,
    backgroundColor: themeDarkPrimaryGray,
    borderRadius: themeRadius[2],
    opacity: isDisabled ? 0.5 : 1
  }),
  multiValueRemove: (styles: CSSProperties) => ({
    ...styles,
    '&:hover': {
      background: 'transparent',
      color: 'inherit'
    }
  }),
  option: (styles: CSSProperties, {isFocused}: {isFocused: boolean}) => ({
    ...styles,
    backgroundColor: isFocused ? themeDarkPrimaryBlue : 'transparent',
    borderRadius: themeRadius[2],
    color: isFocused ? black.hex : 'inherit',
    padding: '4px 6px', // TODO: use theme value
    '&:hover': {
      backgroundColor: themeDarkPrimaryBlue,
      color: black.hex
    }
  }),
  placeholder: (styles: CSSProperties) => ({
    ...styles,
    marginLeft: themeSpace[2]
  }),
  valueContainer: (styles: CSSProperties) => ({
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
  return (
    <components.MenuList
      {...props}
      className="media__custom-scrollbar media__react-select__menu-list"
    >
      {props.children}
    </components.MenuList>
  )
}

const MultiValueLabel = (props: any) => {
  return (
    <Box paddingLeft={1} paddingRight={0} paddingY={1}>
      <Text size={2} weight="semibold">
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

export const reactSelectComponents = {
  DropdownIndicator,
  IndicatorSeparator: null,
  Menu,
  MenuList,
  MultiValueLabel,
  MultiValueRemove,
  Option
}
