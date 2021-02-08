import {studioTheme} from '@sanity/ui'

const sizes: string[] & Record<string, any> = []

const space: string[] & Record<string, any> = [
  '0.0rem',
  '0.3rem',
  '0.6rem',
  '1.2rem',
  '2.4rem',
  '4.8rem'
]

const theme = {
  breakpoints: studioTheme.container.map(width => `${width}px`),
  gridTemplateColumns: {
    tableSmall: '3rem 100px auto 1.5rem',
    tableLarge: '3rem 100px auto 5.5rem 5.5rem 3.5rem 8.5rem 2rem'
  },
  sizes,
  space
}

export default theme
