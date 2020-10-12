// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    borders: Record<string, string>
    breakpoints: string[]
    colors: Record<string, string>
    fonts?: Record<string, string>
    fontSizes?: string[]
    fontWeights?: Record<string, number>
    gridTemplateColumns?: Record<string, string>
    letterSpacings?: Record<string, string>
    lineHeights?: Record<string, string>
    mediaQueries?: Record<string, string>
    sizes: string[] & Record<string, any>
    space: string[] & Record<string, any>
    tableRowHeight: string | string[]
    zIndices?: Record<string, number>
  }
}
