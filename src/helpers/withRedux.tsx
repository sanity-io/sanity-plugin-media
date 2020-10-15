import React, {Component, ComponentType} from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {createEpicMiddleware} from 'redux-observable'

import {getFilters} from '../config'
import {rootEpic, rootReducer} from '../modules'
import {initialState as assetsInitialState} from '../modules/assets'

function withRedux<T>(ComposedComponent: ComponentType<T>) {
  const displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component'

  return class WithReduxComponent extends Component<T> {
    static displayName = `withRedux(${displayName})`
    store: any

    constructor(props: T) {
      super(props)

      // Initialize redux middleware and create store.
      // Redux store isn't persisted between mounts.
      const epicMiddleware = createEpicMiddleware()

      // Get available filters, depending on whether the `document` prop is available or not.
      // TODO: correctly type
      // @ts-ignore
      const filters = getFilters(props?.document)

      this.store = createStore(
        rootReducer,
        {
          assets: {
            ...assetsInitialState,
            filter: filters[0],
            filters
          },
          // TODO: correctly type
          // @ts-ignore
          document: props?.document
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
