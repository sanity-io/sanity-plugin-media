import {black, hues, white} from '@sanity/color'
import {CloseIcon} from '@sanity/icons'
import {Box, Card, studioTheme, Text} from '@sanity/ui'
import React from 'react'
import {components, StylesConfig} from 'react-select'
import {Virtuoso} from 'react-virtuoso'

const themeDarkPrimaryBlue = studioTheme?.color?.dark?.primary?.spot?.blue
const themeDarkDefaultBaseBg = studioTheme?.color?.dark?.default?.base?.bg
const themeRadius = studioTheme?.radius
const themeSpace = studioTheme?.space
const themeTextSizes = studioTheme?.fonts?.text?.sizes

export const reactSelectStyles: StylesConfig<
  {
    label: string
    value: string
  },
  false
> = {
  control: (styles, {isDisabled, isFocused}) => {
    let boxShadow = `inset 0 0 0 1px ${hues.gray[900].hex}`
    if (isFocused) {
      boxShadow = `inset 0 0 0 1px ${hues.gray[900].hex}, 0 0 0 1px var(--card-bg-color), 0 0 0 3px var(--card-focus-ring-color) !important`
    }

    return {
      ...styles,
      backgroundColor: themeDarkDefaultBaseBg,
      color: white.hex,
      border: 'none',
      borderRadius: themeRadius[2],
      boxShadow,
      fontSize: themeTextSizes[1].fontSize,
      minHeight: '25px',
      opacity: isDisabled ? 0.5 : 'inherit',
      outline: 'none',
      transition: 'none',
      '&:hover': {
        boxShadow: `inset 0 0 0 1px ${studioTheme.color.dark.default.input.default.hovered.border}`
      }
    }
  },
  input: styles => ({
    ...styles,
    color: white.hex,
    fontFamily: studioTheme.fonts.text.family,
    marginLeft: themeSpace[2]
  }),
  menuList: styles => ({
    ...styles,
    padding: 0
  }),
  noOptionsMessage: styles => ({
    ...styles,
    fontFamily: studioTheme.fonts.text.family,
    fontSize: themeTextSizes[1].fontSize,
    lineHeight: '1em'
  }),
  option: (styles, {isFocused}) => ({
    ...styles,
    backgroundColor: isFocused ? themeDarkPrimaryBlue : 'transparent',
    borderRadius: themeRadius[2],
    color: isFocused ? black.hex : 'inherit',
    fontSize: themeTextSizes[1].fontSize,
    lineHeight: '1em',
    padding: '4px 6px', // TODO: use theme value
    '&:hover': {
      backgroundColor: themeDarkPrimaryBlue,
      color: black.hex
    }
  }),
  placeholder: styles => ({
    ...styles,
    fontFamily: studioTheme.fonts.text.family,
    marginLeft: themeSpace[2],
    paddingBottom: '2px'
  }),
  singleValue: styles => ({
    ...styles,
    color: white.hex,
    lineHeight: '1em',
    paddingBottom: '1px'
  }),
  valueContainer: styles => ({
    ...styles,
    margin: 0,
    padding: 0
  })
}

const ClearIndicator = (props: any) => {
  return (
    <components.ClearIndicator {...props}>
      <Box
        paddingRight={1}
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
      <Card radius={1} shadow={2}>
        {props.children}
      </Card>
    </components.Menu>
  )
}

const MenuList = (props: any) => {
  const {children} = props

  const MAX_ROWS = 5
  const OPTION_HEIGHT = 33

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

const NoOptionsMessage = (props: any) => {
  return <components.NoOptionsMessage {...props}>{props.children}</components.NoOptionsMessage>
}

const Option = (props: any) => {
  return (
    <Box padding={1}>
      <components.Option {...props}>
        <Box paddingY={1}>
          <Text size={1} style={{color: 'inherit'}} textOverflow="ellipsis">
            {props.children}
          </Text>
        </Box>
      </components.Option>
    </Box>
  )
}

const SingleValue = (props: any) => {
  return (
    <components.SingleValue {...props}>
      <Box paddingLeft={2}>
        <Text
          size={1}
          style={{
            color: 'inherit',
            lineHeight: '2em' // HACK: prevent text descenders from cropping
          }}
          textOverflow="ellipsis"
        >
          {props.children}
        </Text>
      </Box>
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
