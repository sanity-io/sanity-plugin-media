import React, {Component, ComponentType} from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {createEpicMiddleware} from 'redux-observable'
import {rootEpic, rootReducer} from '../modules'

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

      this.store = createStore(
        rootReducer,
        {},
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
