import {DefaultTheme, createGlobalStyle} from 'styled-components'

const HEADER_ROW_HEIGHT = 50 // px

const headerRowHeight = (rows = 1) => `${HEADER_ROW_HEIGHT * rows}px`
const tableHeaderHeight = '34px'
const tableRowHeight = ['115px', '100px']

const sizes: string[] & Record<string, any> = []
sizes.headerRowHeight = headerRowHeight(1)
sizes.headerRowHeight2x = headerRowHeight(2)
sizes.headerRowHeight3x = headerRowHeight(3)
sizes.headerRowHeight4x = headerRowHeight(4)
sizes.tableHeaderHeight = tableHeaderHeight
sizes.tableRowHeight = tableRowHeight

const space: string[] & Record<string, any> = [
  '0.0rem',
  '0.3rem',
  '0.6rem',
  '1.2rem',
  '2.4rem',
  '4.8rem'
]
space.headerRowHeight = headerRowHeight(1)
space.headerRowHeight2x = headerRowHeight(2)
space.headerRowHeight3x = headerRowHeight(3)
space.headerRowHeight4x = headerRowHeight(4)
space.tableHeaderHeight = tableHeaderHeight
space.tableRowHeight = tableRowHeight

const theme: DefaultTheme = {
  // Remember that em units in media queries are always relative to 16px / the user setting
  // and NOT the html font size!
  borders: {},
  breakpoints: ['55em'] as string[],
  colors: {
    // grayscale
    white: '#FFFFFF',
    lighterGray: '#CCCCCC',
    lightGray: '#999',
    gray: '#555',
    darkGray: '#303030',
    darkerGray: '#222',
    darkestGray: '#1C1C1C',
    black: '#000',
    // colors
    red: '#F03E31',
    // alpha
    overlayCard: 'rgba(255, 255, 255, 0.075)',
    overlayTableRow: 'rgba(255, 255, 255, 0.035)'
  },
  gridTemplateColumns: {
    tableSmall: '1.5rem 8rem auto 1.5rem',
    tableLarge: '1.5rem 6rem auto 5.5rem 2.75rem 3.5rem 8.5rem 2rem'
  },
  fonts: {
    default: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
  },
  fontSizes: ['10px', '12px', '14px', '16px'],
  sizes,
  space,
  tableRowHeight,
  /*
    We have two z-index values for the app wrapper:
    - 'appInline' (when selecting an image within a document)
    - 'appTool' (if you click the media plugin from the navbar).

    When this plugin is invoked in an 'inline' context, it's always displayed fullscreen and we need to make sure it
    sits above any popover (since it's possible for the plugin to be invoked from such - e.g. a nested object in an array)

    When the plugin is invoked as a tool, the navbar is always visible and we need to make sure it sits underneath, to allow
    navbar specific dropdowns to display correctly.

    Sanity's z-index values:
    https://github.com/sanity-io/sanity/blob/next/packages/%40sanity/base/src/styles/variables/layers.css
  */
  zIndices: {
    modal: 1081,
    appInline: 1080,
    appTool: 900,
    header: 1
  }
}

export const GlobalStyle = createGlobalStyle`
  /* Custom scrollbar for the react-window and dialog viewports */
  .custom-scrollbar {
    ::-webkit-scrollbar {
      width: 14px;
      height: 14px;
    }
    ::-webkit-scrollbar-button {
      width: 0px;
      height: 0px;
    }
    ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.darkGray};
      border: none;
      border-radius: 0px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${props => props.theme.colors.gray};
    }
    ::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.darkestGray};
      border: none;
      border-radius: 0px;
    }
  }

  /* Revert normalize.css' font-family changes */
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
  }
`

export default theme
