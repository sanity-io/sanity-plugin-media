import produce from 'immer'
import {ofType} from 'redux-observable'
import {ignoreElements, tap} from 'rxjs/operators'

import {ORDERS} from '../../config'
import {BrowserFilter, BrowserOrder, BrowserView} from '../../types'
import {BrowserActions, BrowserReducerState} from './types'

/***********
 * ACTIONS *
 ***********/

export enum BrowserActionTypes {
  FETCH_NEXT_PAGE = 'BROWSER_FETCH_NEXT_PAGE',
  SET_FILTER = 'BROWSER_SET_FILTER',
  SET_ORDER = 'BROWSER_SET_ORDER',
  SET_SEARCH_QUERY = 'BROWSER_SET_SEARCH_QUERY',
  SET_VIEW = 'BROWSER_SET_VIEW'
}

/***********
 * REDUCER *
 ***********/

export const initialState: BrowserReducerState = {
  filter: undefined,
  filters: undefined,
  order: ORDERS[0],
  pageIndex: 0,
  replaceOnFetch: false,
  searchQuery: '',
  view: 'grid'
}

export default function browserReducer(
  state: BrowserReducerState = initialState,
  action: BrowserActions
) {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case BrowserActionTypes.FETCH_NEXT_PAGE:
        draft.pageIndex += 1
        draft.replaceOnFetch = false
        break
      case BrowserActionTypes.SET_FILTER:
        draft.filter = action.payload?.filter
        draft.pageIndex = 0
        draft.replaceOnFetch = true
        break
      case BrowserActionTypes.SET_ORDER:
        draft.order = action.payload?.order
        draft.pageIndex = 0
        draft.replaceOnFetch = true
        break
      case BrowserActionTypes.SET_SEARCH_QUERY:
        draft.searchQuery = action.payload?.searchQuery
        draft.pageIndex = 0
        draft.replaceOnFetch = true
        break
      case BrowserActionTypes.SET_VIEW:
        draft.view = action.payload?.view
        break
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// TODO: use epic
// Fetch next page
export const browserFetchNextPage = () => ({
  type: BrowserActionTypes.FETCH_NEXT_PAGE
})

// Set view mode
export const browserSetView = (view: BrowserView) => ({
  payload: {
    view
  },
  type: BrowserActionTypes.SET_VIEW
})

// Set filter
export const browserSetFilter = (filter: BrowserFilter) => ({
  payload: {
    filter
  },
  type: BrowserActionTypes.SET_FILTER
})

// Set order
export const browserSetOrder = (order: BrowserOrder) => ({
  payload: {
    order
  },
  type: BrowserActionTypes.SET_ORDER
})

// Set search query
export const browserSetSearchQuery = (searchQuery: string) => ({
  payload: {
    searchQuery
  },
  type: BrowserActionTypes.SET_SEARCH_QUERY
})

/*********
 * EPICS *
 *********/

export const browserFetchNextPageEpic = (action$: any) =>
  action$.pipe(
    ofType(BrowserActionTypes.FETCH_NEXT_PAGE),
    tap(() => {
      // console.log('fetch next page')
    }),
    ignoreElements()
  )

export const browserFetchPageEpic = (action$: any) =>
  action$.pipe(
    ofType(
      BrowserActionTypes.SET_ORDER,
      BrowserActionTypes.SET_FILTER,
      BrowserActionTypes.SET_SEARCH_QUERY
    ),
    tap(() => {
      // console.log('fetch from beginning')
    }),
    ignoreElements()
  )
