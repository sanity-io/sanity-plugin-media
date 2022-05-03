import {studioTheme} from '@sanity/ui'
import {useEffect, useState} from 'react'

// Determine the current breakpoint index
// - create MediaQueryLists from every breakpoint defined in our sanity studio theme
// - for each MQL, listen to change events and return the selected breakpoint index
const useBreakpointIndex = (): number => {
  const mediaQueryLists = studioTheme?.container?.map(width =>
    window.matchMedia(`(max-width: ${width}px)`)
  )

  const getBreakpointIndex = () => mediaQueryLists.findIndex(mql => mql.matches)

  const [value, setValue] = useState(getBreakpointIndex())

  useEffect(() => {
    const handleBreakpoint = () => {
      setValue(getBreakpointIndex)
    }

    // NOTE: older versions of Safari use the older `addListener` and `removeListener` methods
    mediaQueryLists.forEach(mql => {
      try {
        mql.addEventListener('change', handleBreakpoint)
      } catch (err) {
        try {
          mql.addListener(handleBreakpoint)
        } catch (_err) {
          // Do nothing
        }
      }
    })
    return () => {
      try {
        mediaQueryLists.forEach(mql => mql.removeEventListener('change', handleBreakpoint))
      } catch (err) {
        try {
          mediaQueryLists.forEach(mql => mql.removeListener(handleBreakpoint))
        } catch (_err) {
          // Do nothing
        }
      }
    }
  }, [])

  return value
}

export default useBreakpointIndex
