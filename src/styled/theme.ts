import {createGlobalStyle} from 'styled-components'

// Extend DefaultTheme interface
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Record<string, string>
    zIndices: Record<string, number>
  }
}

const headerHeight = ['100px', '50px']
const tableHeaderHeight = '34px'
const tableRowHeight = ['115px', '100px']

const sizes: string[] & {
  [key: string]: any
} = []
sizes.headerHeight = headerHeight
sizes.tableHeaderHeight = tableHeaderHeight
sizes.tableRowHeight = tableRowHeight

const space: string[] & {
  [key: string]: any
} = ['0.0rem', '0.3rem', '0.6rem', '1.2rem', '2.4rem', '4.8rem']
space.headerHeight = headerHeight
space.tableHeaderHeight = tableHeaderHeight
space.tableRowHeight = tableRowHeight

const theme = {
  // Remember that em units in media queries are always relative to 16px / the user setting
  // and NOT the html font size!
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
    red: '#E66666',
    // alpha
    overlayCard: 'rgba(255, 255, 255, 0.075)',
    overlayTableRow: 'rgba(255, 255, 255, 0.035)'
  },
  gridTemplateColumns: {
    tableSmall: '8rem auto 1.5rem',
    tableLarge: '6rem auto 5.5rem 2.75rem 3.5rem 8.5rem 2rem'
  },
  // Perfect fourth / 1.333
  fontSizes: ['0.563rem', '0.75rem', '1.0rem', '1.333rem'],
  sizes,
  space,
  tableRowHeight,
  zIndices: {
    dropdowns: 3700,
    dialog: 3600,
    app: 3500,
    header: 1
  }
}

export const GlobalStyle = createGlobalStyle`
  /* Custom scrollbar for the main browser viewport */
  .sanity-media-custom-scrollbar {
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

  /*
    Override Sanity's default z-index for dialogs.

    It's possible that sanity-media is invoked from an existing dialog - such as an object within portable text.
    Since sanity-media needs to sit above any dialog that may invoke it, future dialogs invoked by this plugin
    need to in-turn sit on a higher stacking order.

    E.g.
    - sanity's default dialog z-index: 1060
    - this plugin: 5000
    - dialogs opened by this plugin: 5010
  */
  .sanity-media-dialog {
    z-index: ${props => props.theme.zIndices.dialog};
  }

  /*
    The most horrible of hacks, don't judge me...

    Here we manually set a higher z-index for Sanity's button dropdowns, which by default set at the
    same stacking order as dialogs.
    This is problematic for the reasons listed above - this plugin needs to sit above existing dialogs / portals,
    but also needs to allow other dialogs / dropdowns to appear above it.
    At this point it may be worth not using any of Sanity's existing parts within this plugin and keep it completely separate.
  */
  div[class^="Poppable_portal"] {
    z-index: ${props => props.theme.zIndices.dropdowns};
  }
`

export default theme
