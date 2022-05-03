import isHotkey from 'is-hotkey'
import {RefObject, useEffect, useRef} from 'react'

const useKeyPress = (hotkey: string, onPress?: () => void): RefObject<boolean> => {
  const keyPressed = useRef(false)

  // If pressed key is our target key then set to true
  function downHandler(e: KeyboardEvent) {
    if (isHotkey(hotkey, e)) {
      keyPressed.current = true

      if (onPress) {
        onPress()
      }
    }
  }

  // If released key is our target key then set to false
  const upHandler = () => {
    keyPressed.current = false
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}

export default useKeyPress
