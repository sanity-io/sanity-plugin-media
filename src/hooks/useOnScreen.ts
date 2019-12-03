import {RefObject, useEffect, useState} from 'react'

const useOnScreen = (ref: RefObject<HTMLElement>, options = {}, once: boolean) => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
      // Update state when observer callback fires
      setIntersecting(entry.isIntersecting)

      // Stop observing
      if (once && entry.isIntersecting) {
        if (ref.current && observer) {
          observer.unobserve(ref.current)
        }
      }
    }, options)

    if (ref.current && observer) {
      observer.observe(ref.current)
    }

    // Stop observing on unmount
    return () => {
      if (ref.current && observer) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return isIntersecting
}

export default useOnScreen
