import {black, hues, white} from '@sanity/color'
import {AddIcon, ChevronDownIcon, CloseIcon} from '@sanity/icons'
import {Box, Card, Flex, studioTheme, Text} from '@sanity/ui'
import React from 'react'
import {components, StylesConfig} from 'react-select'
import {Virtuoso} from 'react-virtuoso'

const themeDarkPrimaryBlue = studioTheme?.color?.dark?.primary?.spot?.blue
const themeDarkPrimaryGray = studioTheme?.color?.dark?.primary?.spot?.gray
const themeRadius = studioTheme?.radius
const themeSpace = studioTheme?.space

export const reactSelectStyles: StylesConfig<
  {
    label: string
    value: string
  },
  true
> = {
  control: (styles, {isDisabled, isFocused}) => {
    let boxShadow = `inset 0 0 0 1px ${hues.gray[900].hex}`
    if (isFocused) {
      boxShadow = `inset 0 0 0 1px ${hues.gray[900].hex}, 0 0 0 1px var(--card-bg-color), 0 0 0 3px var(--card-focus-ring-color) !important`
    }

    return {
      ...styles,
      background: isDisabled
        ? studioTheme.color.dark.default.input.default.disabled.bg
        : 'transparent',
      color: white.hex,
      border: 'none',
      borderRadius: themeRadius[1],
      boxShadow,
      minHeight: '35px',
      outline: 'none',
      transition: 'none',
      '&:hover': {
        boxShadow: `inset 0 0 0 1px ${studioTheme.color.dark.default.input.default.hovered.border}`
      }
    }
  },
  indicatorsContainer: (styles, {isDisabled}) => ({
    ...styles,
    opacity: isDisabled ? 0.25 : 1
  }),
  input: styles => ({
    ...styles,
    color: white.hex,
    fontFamily: studioTheme.fonts.text.family,
    marginLeft: themeSpace[2]
  }),
  menuList: styles => ({
    ...styles
  }),
  multiValue: (styles, {isDisabled}) => ({
    ...styles,
    backgroundColor: themeDarkPrimaryGray,
    borderRadius: themeRadius[2],
    opacity: isDisabled ? 0.5 : 1
  }),
  multiValueRemove: styles => ({
    ...styles,
    paddingLeft: 0,
    '&:hover': {
      background: 'transparent',
      color: 'inherit'
    }
  }),
  noOptionsMessage: styles => ({
    ...styles,
    fontFamily: studioTheme.fonts.text.family,
    lineHeight: '1em'
  }),
  option: (styles, {isFocused}) => ({
    ...styles,
    backgroundColor: isFocused ? themeDarkPrimaryBlue : 'transparent',
    borderRadius: themeRadius[2],
    color: isFocused ? black.hex : 'inherit',
    fontFamily: studioTheme.fonts.text.family,
    padding: '4px 8px', // TODO: use theme value
    '&:hover': {
      backgroundColor: themeDarkPrimaryBlue,
      color: black.hex
    }
  }),
  placeholder: styles => ({
    ...styles,
    fontFamily: studioTheme.fonts.text.family,
    marginLeft: themeSpace[2]
  }),
  valueContainer: styles => ({
    ...styles,
    marginBottom: themeSpace[0],
    marginLeft: themeSpace[1],
    marginTop: themeSpace[0],
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
      <Card radius={1} shadow={2}>
        {props.children}
      </Card>
    </components.Menu>
  )
}

const MenuList = (props: any) => {
  const {children} = props

  const MAX_ROWS = 5
  const OPTION_HEIGHT = 37

  if (Array.isArray(children)) {
    const height =
      children.length > MAX_ROWS ? OPTION_HEIGHT * MAX_ROWS : children.length * OPTION_HEIGHT

    return (
      <Virtuoso
        className="media__custom-scrollbar"
        itemContent={index => {
          const item = children[index]
          return <Option {...item.props} />
        }}
        style={{height}}
        totalCount={children.length}
      />
    )
  }
  return <components.MenuList {...props}>{children}</components.MenuList>
}

const MultiValueLabel = (props: any) => {
  return (
    <Box paddingLeft={1} paddingRight={0} paddingY={1}>
      <Text size={2} weight="medium">
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
    <Box paddingX={1} paddingY={1}>
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
