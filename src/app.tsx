import {Box, Portal, PortalProvider, studioTheme, ThemeProvider, ToastProvider} from '@sanity/ui'
import {AssetSourceComponentProps} from '@types'
import React, {FC, forwardRef, MouseEvent, Ref} from 'react'
import {ThemeProvider as LegacyThemeProvider} from 'theme-ui'
import Browser from './components/Browser'
import ReduxProvider from './components/ReduxProvider'
import {Z_INDEX_APP, Z_INDEX_TOAST_PROVIDER} from './constants'
import {AssetBrowserDispatchProvider} from './contexts/AssetSourceDispatchContext'
import useKeyPress from './hooks/useKeyPress'
import GlobalStyle from './styled/GlobalStyles'
import theme from './styled/theme'

type Props = AssetSourceComponentProps

const AssetBrowser: FC<Props> = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const {onClose, onSelect, tool} = props

  // Close on escape key press
  useKeyPress('escape', onClose)

  // Stop propagation and prevent document mouse events from firing.
  // This is a bit of a hack to make this work with `editModal = 'popover'` and prevent Sanity's <Popover /> component from
  // prematurely closing, as it attaches events on `document` to detect outside clicks.
  const handleStopPropagation = (e: MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation()
    e.stopPropagation()
  }

  return (
    <ReduxProvider {...props}>
      <ThemeProvider scheme="dark" theme={studioTheme}>
        <LegacyThemeProvider theme={theme}>
          <PortalProvider element={document.body}>
            <ToastProvider zOffset={Z_INDEX_TOAST_PROVIDER}>
              <AssetBrowserDispatchProvider onSelect={onSelect}>
                <GlobalStyle />

                {tool ? (
                  <Box ref={ref} style={{height: '100%', position: 'relative'}}>
                    <Browser onClose={onClose} />
                  </Box>
                ) : (
                  <Portal>
                    <Box
                      onDragEnter={handleStopPropagation}
                      onDragLeave={handleStopPropagation}
                      onDragOver={handleStopPropagation}
                      onDrop={handleStopPropagation}
                      onMouseUp={handleStopPropagation}
                      ref={ref}
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
                      <Browser onClose={onClose} />
                    </Box>
                  </Portal>
                )}
              </AssetBrowserDispatchProvider>
            </ToastProvider>
          </PortalProvider>
        </LegacyThemeProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
})

export default AssetBrowser
