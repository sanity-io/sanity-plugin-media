import {Store, configureStore, getDefaultMiddleware, AnyAction} from '@reduxjs/toolkit'
import React, {Component, ReactNode} from 'react'
import {Provider} from 'react-redux'
import {createEpicMiddleware} from 'redux-observable'

import {rootEpic, rootReducer} from '../../modules'
// import {assetsActions} from '../../modules/assets'
// import {searchActions} from '../../modules/search'
// import {uploadsActions} from '../../modules/uploads'
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
        epicMiddleware,
        ...getDefaultMiddleware({
          /*
          serializableCheck: {
            ignoredActions: [
              assetsActions.deleteError.type,
              uploadsActions.uploadRequest.type,
              uploadsActions.uploadStart.type,
            ]
          },
          */
          // TODO: remove once we're no longer storing non-serializable data in the store
          serializableCheck: false,
          thunk: false
        })
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
