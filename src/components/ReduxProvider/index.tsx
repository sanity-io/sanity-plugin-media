import {type AnyAction, configureStore, type Store} from '@reduxjs/toolkit'
import type {SanityClient} from '@sanity/client'
import type {AssetSourceComponentProps, SanityDocument} from 'sanity'
import {Component, type ReactNode} from 'react'
import {Provider} from 'react-redux'
import {createEpicMiddleware} from 'redux-observable'
import {rootEpic, rootReducer} from '../../modules'
import {initialState as assetsInitialState} from '../../modules/assets'
// import {assetsActions} from '../../modules/assets'
// import {searchActions} from '../../modules/search'
// import {uploadsActions} from '../../modules/uploads'
import type {RootReducerState} from '../../modules/types'
import getDocumentAssetIds from '../../utils/getDocumentAssetIds'

type Props = {
  assetType?: AssetSourceComponentProps['assetType']
  children?: ReactNode
  client: SanityClient
  document?: SanityDocument
  selectedAssets?: AssetSourceComponentProps['selectedAssets']
}

class ReduxProvider extends Component<Props> {
  store: Store

  constructor(props: Props) {
    super(props)

    // Initialize redux store + middleware
    const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, RootReducerState>({
      dependencies: {
        client: props.client // inject sanity client as a dependency to all epics
      }
    })
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
        debug: {
          badConnection: false,
          enabled: false
        },
        dialog: {items: []},
        notifications: {items: []},
        search: {facets: [], query: ''},
        selected: {
          assets: props.selectedAssets || [],
          document: props.document,
          documentAssetIds: props.document ? getDocumentAssetIds(props.document) : []
        },
        tags: {
          allIds: [],
          byIds: {},
          creating: false,
          fetchCount: -1,
          fetching: false,
          panelVisible: true
        },
        uploads: {
          allIds: [],
          byIds: {}
        }
      }
    })
    epicMiddleware.run(rootEpic)
  }

  override render() {
    // @ts-ignore
    return <Provider store={this.store}>{this.props.children}</Provider>
  }
}

export default ReduxProvider
