import {Box, ThemeProvider, ToastProvider, studioTheme} from '@sanity/ui'
import {SanityCustomAssetSourceProps} from '@types'
import React, {FC, MouseEvent} from 'react'
import {ThemeProvider as LegacyThemeProvider} from 'theme-ui'

import {Z_INDEX_APP, Z_INDEX_TOAST_PROVIDER} from './constants'
import {AssetBrowserDispatchProvider} from './contexts/AssetSourceDispatchContext'
import Browser from './components/Browser'
import Portal from './components/Portal'
import ReduxProvider from './components/ReduxProvider'
import useKeyPress from './hooks/useKeyPress'
import GlobalStyle from './styled/GlobalStyles'
import theme from './styled/theme'

type Props = SanityCustomAssetSourceProps

const AssetBrowser: FC<Props> = (props: Props) => {
  const {onClose, onSelect, tool} = props

  // Close on escape key press
  useKeyPress('escape', onClose)

  // Stop propagation and prevent document mouse events from firing.
  // This is a bit of a hack to make this work with `editModal = 'popover'` and prevent Sanity's <Popover /> component from
  // prematurely closing, as it attaches events on `document` to detect outside clicks.
  const handleStopPropagation = (e: MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation()
  }

  return (
    <ReduxProvider {...props}>
      <ThemeProvider scheme="dark" theme={studioTheme}>
        <LegacyThemeProvider theme={theme}>
          <ToastProvider zOffset={Z_INDEX_TOAST_PROVIDER}>
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
        </LegacyThemeProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default AssetBrowser
