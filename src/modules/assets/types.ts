import {Asset, BrowserView, Item, Order, SearchFacetInputProps} from '@types'
import {AssetsActionTypes} from './index'

// Reducer

export type AssetsReducerState = {
  allIds: string[]
  byIds: Record<string, Item>
  fetchCount: number
  fetching: boolean
  fetchingError: any
  lastPicked?: string
  lastTouched?: number
  order?: Order
  pageIndex: number
  pageSize: number
  searchFacets: SearchFacetInputProps[]
  searchQuery: string
  view: BrowserView
  // totalCount: number
}

// Actions

export type AssetsClearAction = {
  type: AssetsActionTypes.CLEAR
}

export type AssetsDeleteCompleteAction = {
  payload: {
    assetId: string
  }
  type: AssetsActionTypes.DELETE_COMPLETE
}

export type AssetsDeleteErrorAction = {
  payload: {
    asset: Asset
    error: {
      statusCode: number
    }
  }
  type: AssetsActionTypes.DELETE_ERROR
}

export type AssetsDeletePickedAction = {
  type: AssetsActionTypes.DELETE_PICKED
}

export type AssetsDeleteRequestAction = {
  payload: {
    asset: Asset
  }
  type: AssetsActionTypes.DELETE_REQUEST
}

export type AssetsFetchCompleteAction = {
  payload: {
    assets: Asset[]
    // totalCount: number
  }
  type: AssetsActionTypes.FETCH_COMPLETE
}

export type AssetsFetchErrorAction = {
  type: AssetsActionTypes.FETCH_ERROR
}

export type AssetsFetchRequestAction = {
  payload: {
    params: Record<string, string>
    query: string
  }
  type: AssetsActionTypes.FETCH_REQUEST
}

export type AssetsListenerDeleteAction = {
  payload: {
    assetId: string
  }
  type: AssetsActionTypes.LISTENER_DELETE
}

export type AssetsListenerUpdateAction = {
  payload: {
    asset: Asset
  }
  type: AssetsActionTypes.LISTENER_UPDATE
}

export type AssetsLoadNextPageAction = {
  type: AssetsActionTypes.LOAD_NEXT_PAGE
}

export type AssetsLoadPageIndexAction = {
  payload: {
    pageIndex: number
  }
  type: AssetsActionTypes.LOAD_PAGE_INDEX
}

export type AssetsPickAction = {
  payload: {
    assetId: string
    picked: boolean
  }
  type: AssetsActionTypes.PICK
}

export type AssetsPickAllAction = {
  type: AssetsActionTypes.PICK_ALL
}

export type AssetsPickClearAction = {
  type: AssetsActionTypes.PICK_CLEAR
}

export type AssetsPickRangeAction = {
  payload: {
    endId: string
    startId: string
  }
  type: AssetsActionTypes.PICK_RANGE
}

export type AssetsSearchFacetsAddAction = {
  payload: {
    facet: SearchFacetInputProps
  }
  type: AssetsActionTypes.SEARCH_FACETS_ADD
}

export type AssetsSearchFacetsClearAction = {
  type: AssetsActionTypes.SEARCH_FACETS_CLEAR
}

export type AssetsSearchFacetsRemoveAction = {
  payload: {
    facetName: string
  }
  type: AssetsActionTypes.SEARCH_FACETS_REMOVE
}

export type AssetsSearchFacetsUpdateAction = {
  payload: {
    facet: SearchFacetInputProps
  }
  type: AssetsActionTypes.SEARCH_FACETS_UPDATE
}

export type AssetsSetOrderAction = {
  payload: {
    order: Order
  }
  type: AssetsActionTypes.SET_ORDER
}

export type AssetsSetSearchQueryAction = {
  payload: {
    searchQuery: string
  }
  type: AssetsActionTypes.SET_SEARCH_QUERY
}

export type AssetsSetViewAction = {
  payload: {
    view: BrowserView
  }
  type: AssetsActionTypes.SET_VIEW
}

export type AssetsUpdateCompleteAction = {
  payload: {
    asset: Asset
  }
  type: AssetsActionTypes.UPDATE_COMPLETE
}

export type AssetsUpdateErrorAction = {
  payload: {
    asset: Asset
    error: {
      statusCode: number
    }
  }
  type: AssetsActionTypes.UPDATE_ERROR
}

export type AssetsUpdateRequestAction = {
  payload: {
    asset: Asset
    formData: Record<string, any>
  }
  type: AssetsActionTypes.UPDATE_REQUEST
}

// All actions

export type AssetsActions =
  | AssetsClearAction
  | AssetsDeleteCompleteAction
  | AssetsDeleteErrorAction
  | AssetsDeleteRequestAction
  | AssetsFetchCompleteAction
  | AssetsFetchErrorAction
  | AssetsFetchRequestAction
  | AssetsListenerDeleteAction
  | AssetsListenerUpdateAction
  | AssetsLoadNextPageAction
  | AssetsLoadPageIndexAction
  | AssetsPickAction
  | AssetsPickAllAction
  | AssetsPickClearAction
  | AssetsPickRangeAction
  | AssetsSearchFacetsAddAction
  | AssetsSearchFacetsClearAction
  | AssetsSearchFacetsRemoveAction
  | AssetsSearchFacetsUpdateAction
  | AssetsSetOrderAction
  | AssetsSetSearchQueryAction
  | AssetsSetViewAction
  | AssetsUpdateCompleteAction
  | AssetsUpdateErrorAction
  | AssetsUpdateRequestAction
