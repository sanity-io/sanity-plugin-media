import {RefObject, useEffect, useState} from 'react'

const useOnScreen = (ref: RefObject<HTMLElement>, options = {}, once: boolean): boolean => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const el = ref.current

    const observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
      // Update state when observer callback fires
      setIntersecting(entry.isIntersecting)

      // Stop observing
      if (el && once && entry.isIntersecting) {
        if (ref.current && observer) {
          observer.unobserve(el)
        }
      }
    }, options)

    if (ref.current && observer) {
      observer.observe(ref.current)
    }

    // Stop observing on unmount
    return () => {
      if (el && observer) {
        observer.unobserve(el)
      }
    }
  }, [once, options, ref])

  return isIntersecting
}

export default useOnScreen
