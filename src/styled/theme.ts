import {studioTheme} from '@sanity/ui'

const theme = {
  // Use @sanity/ui's breakpoints
  breakpoints: studioTheme.media.map(width => `${width}px`),
  gridTemplateColumns: {
    tableSmall: '3rem 100px auto 1.5rem',
    tableLarge: '3rem 100px auto 5.5rem 5.5rem 3.5rem 8.5rem 2rem'
  }
}

export default theme
