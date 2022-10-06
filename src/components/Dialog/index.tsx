import {Dialog as SanityDialog} from '@sanity/ui'
import React, {ComponentProps} from 'react'

const Dialog = (props: ComponentProps<typeof SanityDialog>) => {
  // HACK: Temporarily force fixed positioning on all @sanity/ui <Dialog /> components.
  // The studio is currently setting absolute positioning on all root-level dialogs on the mobile breakpoint,
  // causing unwanted scroll behaviour.
  return <SanityDialog {...props} style={{position: 'fixed'}} />
}

export default Dialog
