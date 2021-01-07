import {AddIcon, CloseIcon} from '@sanity/icons'
import {Box, Card, Flex, Text, studioTheme} from '@sanity/ui'
import {components} from 'react-select'
import React from 'react'

const themeDarkPrimaryBlue = studioTheme?.color?.dark?.primary?.spot?.blue
const themeDarkDefaultBaseBg = studioTheme?.color?.dark?.default?.base?.bg
const themeRadius = studioTheme?.radius
const themeSpace = studioTheme?.space
const themeTextSizes = studioTheme?.fonts?.text?.sizes

export const reactSelectStyles = {
  control: (styles: any, {isDisabled}: {isDisabled: boolean}) => ({
    ...styles,
    backgroundColor: themeDarkDefaultBaseBg,
    color: 'white',
    border: 'none',
    borderRadius: themeRadius[2],
    boxShadow: 'inset 0 0 0 1px #272a2e', // TODO: use theme value
    fontSize: themeTextSizes[1].fontSize,
    minHeight: '25px',
    opacity: isDisabled ? 0.5 : 'inherit',
    outline: 'none'
  }),
  input: (styles: any) => ({
    ...styles,
    color: 'white',
    marginLeft: themeSpace[2]
  }),
  menuList: (styles: any) => ({
    ...styles,
    padding: 0
  }),
  noOptionsMessage: (styles: any) => ({
    ...styles,
    fontSize: themeTextSizes[1].fontSize,
    lineHeight: '1em'
  }),
  option: (styles: any, {isFocused}: {isFocused: boolean}) => ({
    ...styles,
    backgroundColor: isFocused ? themeDarkPrimaryBlue : 'transparent',
    borderRadius: themeRadius[2],
    color: isFocused ? '#1f2123' : 'inherit', // TODO: use theme value
    fontSize: themeTextSizes[1].fontSize,
    lineHeight: '1em',
    padding: '4px 6px', // TODO: use theme value
    '&:hover': {
      backgroundColor: themeDarkPrimaryBlue,
      color: '#1f2123' // TODO: use theme value
    }
  }),
  placeholder: (styles: any) => ({
    ...styles,
    marginLeft: themeSpace[2],
    paddingBottom: '2px'
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#fff',
    lineHeight: '1em',
    paddingBottom: '1px'
  }),
  valueContainer: (styles: any) => ({
    ...styles,
    margin: 0,
    padding: 0
  })
}

const ClearIndicator = (props: any) => {
  return (
    <components.ClearIndicator {...props}>
      <Box
        paddingX={1}
        style={{
          transform: 'scale(0.85)'
        }}
      >
        <Text muted size={0}>
          <CloseIcon />
        </Text>
      </Box>
    </components.ClearIndicator>
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

const NoOptionsMessage = (props: any) => {
  return <components.NoOptionsMessage {...props}>{props.children}</components.NoOptionsMessage>
}

const Option = (props: any) => {
  return (
    <Box padding={1}>
      <components.Option {...props}>
        <Flex align="center">
          {props.data.__isNew__ && <AddIcon />}
          {props.children}
        </Flex>
      </components.Option>
    </Box>
  )
}

const SingleValue = (props: any) => {
  return (
    <components.SingleValue {...props}>
      <Box paddingX={2}>{props.children}</Box>
    </components.SingleValue>
  )
}

export const reactSelectComponents = {
  ClearIndicator,
  DropdownIndicator: null,
  IndicatorSeparator: null,
  Menu,
  MenuList,
  NoOptionsMessage,
  Option,
  SingleValue
}
