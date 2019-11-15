const HEADER_HEIGHT = '3.0625rem' // 49px
const HEADER_HEIGHT_2X = `${3.0625 * 2}rem` // 49px * 2

const sizes: string[] & {
  headerHeight?: string
  headerHeight2x?: string
} = []
sizes.headerHeight = HEADER_HEIGHT
sizes.headerHeight2x = HEADER_HEIGHT_2X

const space: string[] & {
  headerHeight?: string
  headerHeight2x?: string
} = ['0.0rem', '0.3rem', '0.6rem', '1.2rem', '2.4rem', '4.8rem']
space.headerHeight = HEADER_HEIGHT
space.headerHeight2x = HEADER_HEIGHT_2X

export default {
  // Remember that em units in media queries are always relative to 16px / the user setting
  // and NOT the html font size!
  breakpoints: ['35em'],
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
  // Perfect fourth / 1.333
  fontSizes: ['0.563rem', '0.75rem', '1.0rem', '1.333rem'],
  sizes,
  space,
  zIndices: {
    header: 1
  }
}
