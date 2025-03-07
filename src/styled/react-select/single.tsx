import {CloseIcon} from '@sanity/icons'
import {Box, Card, rem, studioTheme, Text, type ThemeColorSchemeKey} from '@sanity/ui'
import {components, type StylesConfig} from 'react-select'
import {Virtuoso} from 'react-virtuoso'
import {getSchemeColor} from '../../utils/getSchemeColor'

const {
  fonts: {
    text: {sizes: themeTextSizes}
  },
  radius: themeRadius,
  space: themeSpace
} = studioTheme

export const reactSelectStyles = (scheme: ThemeColorSchemeKey): StylesConfig => {
  return {
    control: (styles, {isDisabled, isFocused}) => {
      let boxShadow = `inset 0 0 0 1px var(--card-border-color)`
      if (isFocused) {
        boxShadow = `inset 0 0 0 1px ${getSchemeColor(scheme, 'inputEnabledBorder')},
        0 0 0 1px ${getSchemeColor(scheme, 'bg2')},
        0 0 0 3px var(--card-focus-ring-color) !important`
      }

      return {
        ...styles,
        backgroundColor: 'var(--card-bg-color)',
        color: 'inherit',
        border: 'none',
        borderRadius: themeRadius[2],
        boxShadow,
        fontSize: themeTextSizes[1].fontSize,
        minHeight: '25px',
        opacity: isDisabled ? 0.5 : 'inherit',
        outline: 'none',
        transition: 'none',
        '&:hover': {
          boxShadow: `inset 0 0 0 1px ${getSchemeColor(scheme, 'inputHoveredBorder')}`
        }
      }
    },
    input: styles => ({
      ...styles,
      color: 'var(--card-fg-color)',
      fontFamily: studioTheme.fonts.text.family,
      fontSize: themeTextSizes[1].fontSize,
      marginLeft: rem(themeSpace[2])
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
      backgroundColor: isFocused ? getSchemeColor(scheme, 'spotBlue') : 'transparent',
      borderRadius: themeRadius[2],
      color: isFocused ? getSchemeColor(scheme, 'bg') : 'inherit',
      fontSize: themeTextSizes[1].fontSize,
      lineHeight: '1em',
      margin: 0,
      padding: rem(themeSpace[1]),
      '&:hover': {
        backgroundColor: getSchemeColor(scheme, 'spotBlue'),
        color: getSchemeColor(scheme, 'bg')
      }
    }),
    placeholder: styles => ({
      ...styles,
      fontSize: themeTextSizes[1].fontSize,
      marginLeft: rem(themeSpace[2]),
      paddingLeft: 0
    }),
    singleValue: styles => ({
      ...styles,
      alignItems: 'center',
      display: 'inline-flex',
      height: '100%',
      marginLeft: rem(themeSpace[2])
    }),
    valueContainer: styles => ({
      ...styles,
      margin: 0,
      padding: 0
    })
  }
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
      <Text size={1} textOverflow="ellipsis">
        {props.children}
      </Text>
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
