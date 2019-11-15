import React from 'react'
import styled, {ThemeProvider, css} from 'styled-components'

import theme from './styled/theme'
import {AssetBrowserDispatchProvider} from './contexts/AssetBrowserDispatchContext'
import {AssetBrowserStateProvider} from './contexts/AssetBrowserStateContext'
import withRedux from './helpers/withRedux'
import Browser from './components/Browser/Browser'
import Dialogs from './components/Dialogs/Dialogs'
import Snackbars from './components/Snackbars/Snackbars'
import useKeyPress from './hooks/useKeyPress'
import Box from './styled/Box'
import {Asset} from './types'

type Props = {
  onClose: () => void
  onSelect: () => void
  selectedAssets: Asset[]
}

type ContainerProps = {
  fullscreen?: boolean
}

const Container = styled(Box)<ContainerProps>`
  ${props =>
    props.fullscreen &&
    css`
      z-index: 1000;
      position: fixed;
      top: 0;
      left: 0;
    `}
`

const AssetBrowser = (props: Props) => {
  const {onClose, onSelect, selectedAssets} = props

  // Close on escape key press
  useKeyPress('Escape', onClose)

  // TODO: preload selectedAssets in redux store rather than prop drilling
  return (
    <ThemeProvider theme={theme}>
      <AssetBrowserDispatchProvider onSelect={onSelect}>
        <AssetBrowserStateProvider>
          <Container fullscreen={!!onSelect} size="100%">
            <Snackbars />
            <Dialogs />
            <Browser onClose={onClose} selectedAssets={selectedAssets} />
          </Container>
        </AssetBrowserStateProvider>
      </AssetBrowserDispatchProvider>
    </ThemeProvider>
  )
}

export default withRedux(AssetBrowser)
