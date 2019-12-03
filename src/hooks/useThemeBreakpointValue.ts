import {useEffect, useState} from 'react'
import theme from '../styled/theme'

// Reference: https://usehooks.com/useMedia/

function useThemeBreakpointValue(key: string) {
  const breakpoints = theme.breakpoints || []

  const mediaQueryLists = [
    window.matchMedia(`(max-width: ${breakpoints[0]})`),
    ...breakpoints.map(breakpoint => window.matchMedia(`(min-width: ${breakpoint})`))
  ]

  const getBreakpointIndex = () => {
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex(mql => mql.matches)

    // return index
    return index
  }

  const [breakpointIndex, setBreakpointIndex] = useState(getBreakpointIndex)

  // Add event listeners
  useEffect(() => {
    const handleMatchMedia = () => setBreakpointIndex(getBreakpointIndex)
    mediaQueryLists.forEach(mql => mql.addListener(handleMatchMedia))

    // Remove event listeners on cleanup
    return () => {
      mediaQueryLists.forEach(mql => mql.removeListener(handleMatchMedia))
    }
  }, [])

  return (theme as Record<string, any>)[key][breakpointIndex]
}

export default useThemeBreakpointValue
