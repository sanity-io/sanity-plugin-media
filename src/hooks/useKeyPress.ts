import {RefObject, useEffect, useRef} from 'react'

const useKeyPress = (targetKey: string, callback?: () => void): RefObject<boolean> => {
  const keyPressed = useRef(false)

  // If pressed key is our target key then set to true
  function downHandler(e: KeyboardEvent) {
    if (e.key === targetKey) {
      keyPressed.current = true

      if (callback) {
        callback()
      }
    }
  }

  // If released key is our target key then set to false
  const upHandler = (e: KeyboardEvent) => {
    if (e.key === targetKey) {
      keyPressed.current = false
    }
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
