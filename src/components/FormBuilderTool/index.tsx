import {useFormValue} from 'sanity/form'
import type {AssetSourceComponentProps, SanityDocument} from 'sanity'
import {Box} from '@sanity/ui'
import React, {SyntheticEvent} from 'react'
import {Z_INDEX_APP} from '../../constants'
import useKeyPress from '../../hooks/useKeyPress'
import Browser from '../Browser'
import Portal from '../Portal'

const FormBuilderTool = (props: AssetSourceComponentProps) => {
  const {onClose} = props

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

  return (
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
          zIndex: Z_INDEX_APP
        }}
      >
        <Browser document={currentDocument} {...props} />
      </Box>
    </Portal>
  )
}

export default FormBuilderTool
