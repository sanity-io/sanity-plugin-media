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

export default {
  // Remember that em units in media queries are always relative to 16px / the user setting
  // and NOT the html font size!
  breakpoints: ['55em'] as string[],
  colors: {
    // grayscale
    white: '#ffffff',
    lighterGray: '#eee',
    lightGray: '#ccc',
    gray: '#999',
    darkGray: '#555',
    darkerGray: '#222',
    darkestGray: '#1C1C1C',
    black: '#000',
    // colors
    red: '#e66666',
    // alpha
    whiteOverlay: 'rgba(255, 255, 255, 0.075)'
  },
  gridTemplateColumns: {
    tableSmall: '8rem auto 1.5rem',
    tableLarge: '6rem auto 5.25rem 2.5rem 3.25rem 8.5rem 1.5rem'
  },
  // Perfect fourth / 1.333
  fontSizes: ['0.563rem', '0.75rem', '1.0rem', '1.333rem'],
  sizes,
  space,
  tableRowHeight,
  zIndices: {
    header: 1
  }
}
