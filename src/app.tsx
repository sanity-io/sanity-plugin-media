import {Portal} from '@sanity/ui'
import React, {MouseEvent, useLayoutEffect, useEffect} from 'react'
import {ThemeProvider} from 'styled-components'

import {AssetBrowserDispatchProvider} from './contexts/AssetSourceDispatchContext'
import withRedux from './helpers/withRedux'
import Browser from './components/Browser/Browser'
import useKeyPress from './hooks/useKeyPress'
import Box from './styled/Box'
import theme, {GlobalStyle} from './styled/theme'
import {Asset} from './types'

type Props = {
  onClose?: () => void
  onSelect?: () => void
  selectedAssets: Asset[]
  tool?: string
}

const AssetBrowser = (props: Props) => {
  const {onClose, onSelect, selectedAssets, tool} = props

  // Close on escape key press
  useKeyPress('Escape', onClose)

  useLayoutEffect(() => {
    /**
     * HACK: Hide overflow on parent dialog content container.
     * This is done because:
     * 1. On iOS, visible `overflow` and `-webkit-overflow-scrolling: touch` causes nested elements with
     * fixed positiong (the media browser) to crop oddly, as if it's being masked.
     * 2. We don't require visible overflow in the media browser anyway, as that's all delegated to `react-window`
     */
    const dialogContentEl = window.document.querySelector('[class^=DefaultDialog_content]')
    if (dialogContentEl instanceof HTMLElement) {
      dialogContentEl.style.overflow = 'hidden'
    }

    // HACK: Revert overflow on parent dialog content container.
    return () => {
      if (dialogContentEl instanceof HTMLElement) {
        dialogContentEl.style.overflow = 'auto'
      }
    }
  }, [])

  useEffect(() => {
    // Scroll to top if browser is being used as a tool.
    // We do this as we lock body scroll when the plugin is active, and due to overscroll
    // on mobile devices, the menu may not always be positioned at the top of the page.
    if (tool) {
      window.scrollTo(0, 0)
    }

    // Diable scrolling on the body element whilst the plugin is active, re-enable on close
    // Note that this has no effect on iOS < 13
    window.document.body.style.overflow = 'hidden'
    return () => {
      window.document.body.style.overflow = 'auto'
    }
  }, [])

  // Stop propagation and prevent document mouse events from firing.
  // This is a bit of a hack to make this work with `editModal = 'popover'` and prevent Sanity's <Popover /> component from
  // prematurely closing, as it attaches events on `document` to detect outside clicks.
  const handleStopPropagation = (e: MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation()
  }

  // TODO: preload selectedAssets in redux store rather than prop drilling
  return (
    <ThemeProvider theme={theme}>
      <AssetBrowserDispatchProvider onSelect={onSelect}>
        {/* Global styles */}
        <GlobalStyle />

        {tool ? (
          <Box height="100%" position="relative" zIndex="appTool">
            <Browser onClose={onClose} selectedAssets={selectedAssets} />
          </Box>
        ) : (
          <Portal>
            <Box
              bottom={0}
              height="auto"
              left={0}
              onMouseUp={handleStopPropagation}
              position="fixed"
              top={0}
              width="100%"
              zIndex="appInline"
            >
              <Browser onClose={onClose} selectedAssets={selectedAssets} />
            </Box>
          </Portal>
        )}
      </AssetBrowserDispatchProvider>
    </ThemeProvider>
  )
}

export default withRedux(AssetBrowser)
