import React, {useLayoutEffect, useState, useEffect} from 'react'
import {ThemeProvider} from 'styled-components'

import theme, {GlobalStyle} from './styled/theme'
import {AssetBrowserDispatchProvider} from './contexts/AssetBrowserDispatchContext'
import {AssetBrowserStateProvider} from './contexts/AssetBrowserStateContext'
import withRedux from './helpers/withRedux'
import Browser from './components/Browser/Browser'
import Dialogs from './components/Dialogs/Dialogs'
import {Portal} from './components/Portal/Portal'
import Snackbars from './components/Snackbars/Snackbars'
import useKeyPress from './hooks/useKeyPress'
import Box from './styled/Box'
import {Asset, Document} from './types'

type Props = {
  document?: Document
  onClose?: () => void
  onSelect?: () => void
  selectedAssets: Asset[]
}

const AssetBrowser = (props: Props) => {
  const {document, onClose, onSelect, selectedAssets} = props
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  // Both `onClose` and `onSelect` are undefined when directly accessed as a tool
  const isTool = onClose && onSelect

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

    // Measure the height of the studio navbar and adjust positioning.
    // This is required when we access the plugin as a tool (with the navbar visible).
    const navBarEl = window.document.querySelector('[class^=DefaultLayout_navBar]')
    if (navBarEl) {
      const height = navBarEl.getBoundingClientRect().height
      setHeaderHeight(height)
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
    if (isTool) {
      window.scrollTo(0, 0)
    }

    // Diable scrolling on the body element whilst the plugin is active, re-enable on close
    // Note that this has no effect on iOS < 13
    window.document.body.style.overflow = 'hidden'
    return () => {
      window.document.body.style.overflow = 'auto'
    }
  }, [])

  // TODO: preload selectedAssets in redux store rather than prop drilling
  return (
    <ThemeProvider theme={theme}>
      <AssetBrowserDispatchProvider onSelect={onSelect}>
        <AssetBrowserStateProvider>
          <Portal>
            {/* Global styles */}
            <GlobalStyle />

            <Box
              bottom={0}
              height="auto"
              left={0}
              position="fixed"
              width="100%"
              top={isTool ? 0 : headerHeight}
              zIndex="app"
            >
              <Snackbars />
              <Dialogs />
              <Browser document={document} onClose={onClose} selectedAssets={selectedAssets} />
            </Box>
          </Portal>
        </AssetBrowserStateProvider>
      </AssetBrowserDispatchProvider>
    </ThemeProvider>
  )
}

export default withRedux(AssetBrowser)
