import React, {useEffect} from 'react'
import {ThemeProvider} from 'styled-components'

import theme, {GlobalStyle} from './styled/theme'
import {AssetBrowserDispatchProvider} from './contexts/AssetBrowserDispatchContext'
import {AssetBrowserStateProvider} from './contexts/AssetBrowserStateContext'
import withRedux from './helpers/withRedux'
import Browser from './components/Browser/Browser'
import Dialogs from './components/Dialogs/Dialogs'
import Snackbars from './components/Snackbars/Snackbars'
import useKeyPress from './hooks/useKeyPress'
import Box from './styled/Box'
import {Asset, Document} from './types'

type Props = {
  document?: Document
  onClose: () => void
  onSelect: () => void
  selectedAssets: Asset[]
}

const AssetBrowser = (props: Props) => {
  const {document, onClose, onSelect, selectedAssets} = props

  // Close on escape key press
  useKeyPress('Escape', onClose)

  useEffect(() => {
    window.document.body.style.overflowY = 'hidden'
    return () => {
      window.document.body.style.overflowY = 'auto'
    }
  }, [])

  // TODO: preload selectedAssets in redux store rather than prop drilling
  return (
    <ThemeProvider theme={theme}>
      <AssetBrowserDispatchProvider onSelect={onSelect}>
        <AssetBrowserStateProvider>
          {/* Global styles */}
          <GlobalStyle />

          <Box
            bottom={0}
            height="auto"
            left={0}
            overflow="hidden"
            position={onSelect ? 'fixed' : 'absolute'}
            width="100%"
            top={0}
            zIndex="app"
          >
            <Snackbars />
            <Dialogs />
            <Browser document={document} onClose={onClose} selectedAssets={selectedAssets} />
          </Box>
        </AssetBrowserStateProvider>
      </AssetBrowserDispatchProvider>
    </ThemeProvider>
  )
}

export default withRedux(AssetBrowser)
