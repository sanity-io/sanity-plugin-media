import type {RootReducerState} from '../../modules/types'
import {initialState as assetsInitialState} from '../../modules/assets'

export function createTestRootState(overrides: Partial<RootReducerState> = {}): RootReducerState {
  const base: RootReducerState = {
    assets: {
      ...assetsInitialState,
      assetTypes: ['file', 'image']
    },
    debug: {badConnection: false, enabled: false},
    dialog: {items: []},
    notifications: {items: []},
    search: {facets: [], query: ''},
    selected: {assets: [], document: undefined, documentAssetIds: []},
    tags: {
      allIds: [],
      byIds: {},
      creating: false,
      fetchCount: -1,
      fetching: false,
      panelVisible: true
    },
    uploads: {allIds: [], byIds: {}}
  }

  return {...base, ...overrides} as RootReducerState
}
