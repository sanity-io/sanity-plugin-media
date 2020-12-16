import {Asset, BrowserView, Item, DeleteHandleTarget, Order, SearchFacetProps} from '@types'
import {AssetsActionTypes} from './index'

// Reducer

export type AssetsReducerState = {
  allIds: string[]
  byIds: Record<string, Item>
  fetchCount: number
  fetching: boolean
  fetchingError: any
  lastPicked?: string
  order: Order
  pageIndex: number
  pageSize: number
  searchFacets: SearchFacetProps[]
  searchQuery: string
  view: BrowserView
  // totalCount: number
}

// Actions

export type AssetsClearAction = {
  type: AssetsActionTypes.CLEAR
}

export type AssetsDeleteErrorCompleteAction = {
  payload: {
    asset: Asset
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
    handleTarget: DeleteHandleTarget
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
    facet: SearchFacetProps
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
    facet: SearchFacetProps
  }
  type: AssetsActionTypes.SEARCH_FACETS_UPDATE
}

export type AssetsSetOrderAction = {
  payload: {
    order: {
      title: string
      value: string
    }
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

// All actions

export type AssetsActions =
  | AssetsClearAction
  | AssetsDeleteErrorCompleteAction
  | AssetsDeleteErrorAction
  | AssetsDeleteRequestAction
  | AssetsFetchCompleteAction
  | AssetsFetchErrorAction
  | AssetsFetchRequestAction
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
