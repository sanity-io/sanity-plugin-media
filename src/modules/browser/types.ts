import {BrowserView, BrowserFilter, BrowserOrder} from '../../types'
import {BrowserActionTypes} from './index'

// Reducer

export type BrowserReducerState = {
  filter?: BrowserFilter
  filters?: BrowserFilter[]
  order: BrowserOrder
  pageIndex: number
  replaceOnFetch: boolean
  searchQuery?: string
  view: BrowserView
}

// Actions

export type BrowserFetchNextPageAction = {
  type: BrowserActionTypes.FETCH_NEXT_PAGE
}

export type BrowserSetFilterAction = {
  payload: {
    filter: BrowserFilter
  }
  type: BrowserActionTypes.SET_FILTER
}

export type BrowserSetOrderAction = {
  payload: {
    order: BrowserFilter
  }
  type: BrowserActionTypes.SET_ORDER
}

export type BrowserSetSearchQueryAction = {
  payload: {
    searchQuery: string
  }
  type: BrowserActionTypes.SET_SEARCH_QUERY
}

export type BrowserSetViewAction = {
  payload: {
    view: BrowserView
  }
  type: BrowserActionTypes.SET_VIEW
}

// All actions

export type BrowserActions =
  | BrowserFetchNextPageAction
  | BrowserSetFilterAction
  | BrowserSetOrderAction
  | BrowserSetSearchQueryAction
  | BrowserSetViewAction
