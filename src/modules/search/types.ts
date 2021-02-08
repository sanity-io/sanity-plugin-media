import {SearchFacetInputProps, SearchFacetOperatorType, Tag} from '@types'

import {SearchActionTypes} from './index'

// Reducer

export type SearchReducerState = {
  searchFacets: SearchFacetInputProps[]
  searchQuery: string
}

// Actions

export type SearchSetSearchQueryAction = {
  payload: {searchQuery: string}
  type: SearchActionTypes.SET_SEARCH_QUERY
}

export type SearchSearchFacetTagAddOrUpdate = {
  payload: {tag: Tag}
  type: SearchActionTypes.SEARCH_FACET_TAG_ADD_OR_UPDATE
}

export type SearchSearchFacetsAddAction = {
  payload: {facet: SearchFacetInputProps}
  type: SearchActionTypes.SEARCH_FACETS_ADD
}

export type SearchSearchFacetsClearAction = {
  type: SearchActionTypes.SEARCH_FACETS_CLEAR
}

export type SearchSearchFacetsRemoveAction = {
  payload: {facetName: string}
  type: SearchActionTypes.SEARCH_FACETS_REMOVE
}

export type SearchSearchFacetsUpdateAction = {
  payload: {
    modifier?: string
    name: string
    operatorType?: SearchFacetOperatorType
    value?: any // TODO: type correctly
  }
  type: SearchActionTypes.SEARCH_FACETS_UPDATE
}

// All actions

export type SearchActions =
  | SearchSearchFacetTagAddOrUpdate
  | SearchSearchFacetsAddAction
  | SearchSearchFacetsClearAction
  | SearchSearchFacetsRemoveAction
  | SearchSearchFacetsUpdateAction
  | SearchSetSearchQueryAction
