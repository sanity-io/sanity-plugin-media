import {Box, Portal, ThemeProvider, ToastProvider, studioTheme} from '@sanity/ui'
import {SanityCustomAssetSourceProps} from '@types'
import React, {FC, MouseEvent, useLayoutEffect, useEffect} from 'react'
import {ThemeProvider as LegacyThemeProvider} from 'theme-ui'

import {AssetBrowserDispatchProvider} from './contexts/AssetSourceDispatchContext'
import Browser from './components/Browser'
import ReduxProvider from './components/ReduxProvider'
import useKeyPress from './hooks/useKeyPress'
import GlobalStyle from './styled/GlobalStyles'
import theme from './styled/theme'

type Props = SanityCustomAssetSourceProps

const AssetBrowser: FC<Props> = (props: Props) => {
  const {onClose, onSelect, tool} = props

  // Close on escape key press
  useKeyPress('escape', onClose)

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
    const sanityContainerEl: HTMLDivElement | null = window.document.querySelector('#sanity')

    // Scroll to top if browser is being used as a tool.
    // We do this as we lock body scroll when the plugin is active, and due to overscroll
    // on mobile devices, the menu may not always be positioned at the top of the page.
    if (tool) {
      window.scrollTo(0, 0)
    } else {
      if (sanityContainerEl) {
        sanityContainerEl.style.position = 'relative'
        sanityContainerEl.style.zIndex = '-1'
      }
    }

    /*
    // Diable scrolling on the body element whilst the plugin is active, re-enable on close
    // Note that this has no effect on iOS < 13
    window.document.body.style.overflow = 'hidden'
    return () => {
      window.document.body.style.overflow = 'auto'
    }
    */

    return () => {
      if (sanityContainerEl) {
        sanityContainerEl.style.position = 'inherit'
        sanityContainerEl.style.zIndex = 'inherit'
      }
    }
  }, [])

  // Stop propagation and prevent document mouse events from firing.
  // This is a bit of a hack to make this work with `editModal = 'popover'` and prevent Sanity's <Popover /> component from
  // prematurely closing, as it attaches events on `document` to detect outside clicks.
  const handleStopPropagation = (e: MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation()
  }

  return (
    <ReduxProvider {...props}>
      <ThemeProvider theme={studioTheme}>
        <LegacyThemeProvider theme={theme}>
          <ToastProvider>
            <AssetBrowserDispatchProvider onSelect={onSelect}>
              <GlobalStyle />

              {tool ? (
                <Box style={{height: '100%', position: 'relative'}}>
                  <Browser onClose={onClose} />
                </Box>
              ) : (
                <Portal>
                  <Box
                    onMouseUp={handleStopPropagation}
                    style={{
                      bottom: 0,
                      height: 'auto',
                      left: 0,
                      position: 'fixed',
                      top: 0,
                      width: '100%'
                    }}
                  >
                    <Browser onClose={onClose} />
                  </Box>
                </Portal>
              )}
            </AssetBrowserDispatchProvider>
          </ToastProvider>
        </LegacyThemeProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default AssetBrowser
