import type {Plugin, RenderViewer} from '@react-pdf-viewer/core'
import * as React from 'react'

export interface PageThumbnailPluginProps {
  PageThumbnail: React.ReactElement
}

export const thumbnail = (props: PageThumbnailPluginProps): Plugin => {
  const {PageThumbnail} = props

  return {
    renderViewer: (renderProps: RenderViewer) => {
      const {slot} = renderProps

      slot.children = PageThumbnail

      // Reset the sub slot
      if (slot.subSlot) {
        slot.subSlot.attrs = {}
        slot.subSlot.children = <></>
      }

      return slot
    }
  }
}
