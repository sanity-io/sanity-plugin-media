import {AnyAction, configureStore, Store} from '@reduxjs/toolkit'
import {AssetSourceComponentProps} from '@types'
import React, {Component, ReactNode} from 'react'
import {Provider} from 'react-redux'
import {createEpicMiddleware} from 'redux-observable'
import {rootEpic, rootReducer} from '../../modules'
import {initialState as assetsInitialState} from '../../modules/assets'
// import {assetsActions} from '../../modules/assets'
// import {searchActions} from '../../modules/search'
// import {uploadsActions} from '../../modules/uploads'
import {RootReducerState} from '../../modules/types'
import getDocumentAssetIds from '../../utils/getDocumentAssetIds'

type Props = AssetSourceComponentProps

class ReduxProvider extends Component<Props> {
  store: Store

  constructor(props: Props) {
    super(props)

    // Initialize redux store + middleware
    const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, RootReducerState>()
    this.store = configureStore({
      reducer: rootReducer,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
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
        }).prepend(epicMiddleware),
      devTools: true,
      preloadedState: {
        assets: {
          ...assetsInitialState,
          assetTypes: props?.assetType ? [props.assetType] : ['file', 'image']
        },
        selected: {
          assets: props.selectedAssets,
          document: props.document,
          documentAssetIds: props.document ? getDocumentAssetIds(props.document) : []
        }
      }
    })
    epicMiddleware.run(rootEpic)
  }

  render(): ReactNode {
    return <Provider store={this.store}>{this.props.children}</Provider>
  }
}

export default ReduxProvider
