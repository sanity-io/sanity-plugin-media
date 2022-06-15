import {ReactNode, ReactPortal, useEffect, useState} from 'react'
import {createPortal} from 'react-dom'

interface Props {
  children: ReactNode
  className?: string
}

const Portal = (props: Props): ReactPortal => {
  const {children, className = 'media-portal'} = props
  const [container] = useState(() => document.createElement('div'))

  useEffect(() => {
    container.classList.add(className)
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  })

  return createPortal(children, container)
}

export default Portal
