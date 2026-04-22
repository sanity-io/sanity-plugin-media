import type {ReactElement, ReactNode} from 'react'
import {configureStore} from '@reduxjs/toolkit'
import {studioTheme, ThemeProvider, ToastProvider} from '@sanity/ui'
import {ColorSchemeProvider} from 'sanity'
import {Provider} from 'react-redux'
import {render} from '@testing-library/react'
import {AssetBrowserDispatchProvider} from '../../contexts/AssetSourceDispatchContext'
import {ToolOptionsProvider} from '../../contexts/ToolOptionsContext'
import {rootReducer} from '../../modules'
import type {RootReducerState} from '../../modules/types'
import type {MediaToolOptions} from '../../types'
import {createTestRootState} from './rootState'
import type {AssetSourceComponentProps} from 'sanity'

type Opts = {
  onSelect?: AssetSourceComponentProps['onSelect']
  preloaded?: Partial<RootReducerState>
  toolOptions?: Partial<MediaToolOptions>
}

export function renderWithProviders(ui: ReactElement, opts: Opts = {}) {
  const {onSelect, preloaded, toolOptions} = opts

  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({thunk: false, serializableCheck: false}),
    preloadedState: createTestRootState(preloaded)
  })

  const options: MediaToolOptions = {
    creditLine: {enabled: false},
    directUploads: true,
    ...toolOptions
  }

  const wrap = (node: ReactNode) => (
    <Provider store={store}>
      <ColorSchemeProvider scheme="light">
        <ToolOptionsProvider options={options}>
          <ThemeProvider theme={studioTheme}>
            <ToastProvider>
              <AssetBrowserDispatchProvider onSelect={onSelect}>
                {node}
              </AssetBrowserDispatchProvider>
            </ToastProvider>
          </ThemeProvider>
        </ToolOptionsProvider>
      </ColorSchemeProvider>
    </Provider>
  )

  return {store, ...render(wrap(ui))}
}
