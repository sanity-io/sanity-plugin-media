import React, {useLayoutEffect, useState, useEffect} from 'react'
import {ThemeProvider} from 'styled-components'

import theme from './styled/theme'
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
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  // Close on escape key press
  useKeyPress('Escape', onClose)

  useLayoutEffect(() => {
    const navBar = window.document.querySelectorAll('[class^=DefaultLayout_navBar]')[0]
    if (navBar) {
      const height = navBar.getBoundingClientRect().height
      setHeaderHeight(height)
    }
  }, [])

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
          <Box left={0} position="fixed" size="100%" top={onSelect ? 0 : headerHeight} zIndex="app">
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
