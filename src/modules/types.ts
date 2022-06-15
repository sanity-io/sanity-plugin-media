import {$CombinedState} from 'redux'

import {rootReducer} from './index'

// HACK: Extend RootReducerState to include $CombinedState to workaround
// this issue: https://stackoverflow.com/a/72030202
export type RootReducerState = ReturnType<typeof rootReducer> & {
  readonly [$CombinedState]?: undefined
}
