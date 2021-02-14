import {Store, configureStore, getDefaultMiddleware, AnyAction} from '@reduxjs/toolkit'
import React, {Component, ReactNode} from 'react'
import {Provider} from 'react-redux'
import {createEpicMiddleware} from 'redux-observable'

import {rootEpic, rootReducer} from '../../modules'
import {RootReducerState} from '../../modules/types'
import {SanityCustomAssetSourceProps} from '../../types'

type Props = SanityCustomAssetSourceProps
class ReduxProvider extends Component<Props> {
  store: Store

  constructor(props: Props) {
    super(props)

    // Initialize redux store + middleware
    const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, RootReducerState>()
    this.store = configureStore({
      reducer: rootReducer,
      middleware: [
        ...getDefaultMiddleware({thunk: false}), //
        epicMiddleware
      ],
      devTools: true,
      preloadedState: {
        document: props.document,
        selectedAssets: props.selectedAssets
      }
    })
    epicMiddleware.run(rootEpic)
  }

  render(): ReactNode {
    return <Provider store={this.store}>{this.props.children}</Provider>
  }
}

export default ReduxProvider
