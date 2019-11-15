import React, {useEffect, useRef} from 'react'
import useOnScreen from '../../hooks/useOnScreen'
import Box from '../../styled/Box'

type Props = {
  onHidden?: Function
  onVisible?: Function
  onVisibleOnce?: boolean
}

const ViewportObserver = (props: Props) => {
  const {onHidden, onVisible, onVisibleOnce = false} = props

  const ref = useRef(null)
  const inViewport = useOnScreen(
    ref,
    {
      threshold: 0
    },
    onVisibleOnce
  )

  useEffect(() => {
    if (inViewport) {
      if (onVisible) {
        onVisible()
      }
    } else {
      if (onHidden) {
        onHidden()
      }
    }
  }, [inViewport])

  return <Box bg="transparent" mt="-200px" ref={ref} size="200px" />
}

export default ViewportObserver
