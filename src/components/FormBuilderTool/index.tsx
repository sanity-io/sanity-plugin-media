import {Box, Portal, PortalProvider, useLayer} from '@sanity/ui'
import React, {SyntheticEvent, useEffect, useState} from 'react'
import {AssetSourceComponentProps, SanityDocument, useFormValue} from 'sanity'
import useKeyPress from '../../hooks/useKeyPress'
import Browser from '../Browser'

const FormBuilderTool = (props: AssetSourceComponentProps) => {
  const {onClose} = props

  const portalElement = useRootPortalElement()

  // Get current Sanity document
  const currentDocument = useFormValue([]) as SanityDocument

  // Close on escape key press
  useKeyPress('escape', onClose)

  // Stop propagation and prevent document mouse events from firing.
  // This is a bit of a hack to make this work with `editModal = 'popover'` and prevent Sanity's <Popover /> component from
  // prematurely closing, as it attaches events on `document` to detect outside clicks.
  const handleStopPropagation = (event: SyntheticEvent) => {
    event.nativeEvent.stopImmediatePropagation()
    event.stopPropagation()
  }

  const {zIndex} = useLayer()

  return (
    <PortalProvider element={portalElement}>
      <Portal>
        <Box
          onDragEnter={handleStopPropagation}
          onDragLeave={handleStopPropagation}
          onDragOver={handleStopPropagation}
          onDrop={handleStopPropagation}
          onMouseUp={handleStopPropagation}
          style={{
            bottom: 0,
            height: 'auto',
            left: 0,
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex
          }}
        >
          <Browser document={currentDocument} {...props} />
        </Box>
      </Portal>
    </PortalProvider>
  )
}

export default FormBuilderTool

const useRootPortalElement = () => {
  const [container] = useState(() => document.createElement('div'))

  useEffect(() => {
    container.classList.add('media-portal')
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [])

  return container
}
