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
    folders: {
      byId: {},
      childrenByParentId: {},
      rootIds: [],
      exactCountByFolderId: {},
      unfiledCount: 0,
      currentFolderId: null,
      currentFolderUnfiled: false,
      panelVisible: true,
      fetching: false,
      fetchCount: -1,
      creating: false,
      renaming: false,
      moving: false
    },
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
