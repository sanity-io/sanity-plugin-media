import {configureStore, type AnyAction, type EnhancedStore} from '@reduxjs/toolkit'
import type {SanityClient} from '@sanity/client'
import type {Epic} from 'redux-observable'
import {createEpicMiddleware} from 'redux-observable'
import {rootReducer} from '../../modules'
import type {RootReducerState} from '../../modules/types'
import {createTestRootState} from './rootState'

export function createEpicTestStore(
  epic: Epic<AnyAction, AnyAction, RootReducerState, {client: SanityClient}>,
  mockClient: SanityClient,
  preloaded?: Partial<RootReducerState>
): EnhancedStore<RootReducerState, AnyAction> {
  const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, RootReducerState>({
    dependencies: {client: mockClient}
  })

  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({serializableCheck: false, thunk: false}).concat(epicMiddleware),
    preloadedState: createTestRootState(preloaded)
  })

  epicMiddleware.run(epic)
  return store
}
