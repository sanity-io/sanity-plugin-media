import {useEffect, useState} from 'react'

function useKeyPress(targetKey: string, callback?: Function) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key then set to true
  function downHandler(e: KeyboardEvent) {
    if (e.key === targetKey) {
      setKeyPressed(true)
      if (callback) {
        callback()
      }
    }
  }

  // If released key is our target key then set to false
  const upHandler = (e: KeyboardEvent) => {
    if (e.key === targetKey) {
      setKeyPressed(false)
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
