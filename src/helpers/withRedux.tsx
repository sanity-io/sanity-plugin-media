import React, {Component, ComponentType} from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {createEpicMiddleware} from 'redux-observable'

import {rootEpic, rootReducer} from '../modules'
import {initialState as assetsInitialState} from '../modules/assets'

function withRedux<T>(ComposedComponent: ComponentType<T>) {
  const displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component'

  return class WithReduxComponent extends Component<T> {
    static displayName = `withRedux(${displayName})`
    // TODO: correctly type
    store: any

    constructor(props: T) {
      super(props)

      // Initialize redux middleware and create store.
      // Redux store isn't persisted between mounts.
      const epicMiddleware = createEpicMiddleware()

      this.store = createStore(
        rootReducer,
        {
          assets: {
            ...assetsInitialState
          },
          // TODO: correctly type
          // @ts-ignore
          document: props?.document,
          // TODO: correctly type
          // @ts-ignore
          selectedAssets: props?.selectedAssets
        },
        composeWithDevTools(applyMiddleware(epicMiddleware))
      )
      epicMiddleware.run(rootEpic)
    }

    render() {
      return (
        <Provider store={this.store}>
          <ComposedComponent {...this.props} />
        </Provider>
      )
    }
  }
}

export default withRedux
