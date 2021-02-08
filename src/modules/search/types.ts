import {SearchFacetInputProps, SearchFacetOperatorType, Tag} from '@types'

import {SearchActionTypes} from './index'

// Reducer

export type SearchReducerState = {
  facets: SearchFacetInputProps[]
  query: string
}

// Actions

export type SearchFacetsAddAction = {
  payload: {facet: SearchFacetInputProps}
  type: SearchActionTypes.SEARCH_FACETS_ADD
}

export type SearchFacetsClearAction = {
  type: SearchActionTypes.SEARCH_FACETS_CLEAR
}

export type SearchFacetsRemoveAction = {
  payload: {facetName: string}
  type: SearchActionTypes.SEARCH_FACETS_REMOVE
}

export type SearchFacetsUpdateAction = {
  payload: {
    modifier?: string
    name: string
    operatorType?: SearchFacetOperatorType
    value?: any // TODO: type correctly
  }
  type: SearchActionTypes.SEARCH_FACETS_UPDATE
}

export type SearchQuerySetAction = {
  payload: {searchQuery: string}
  type: SearchActionTypes.SEARCH_QUERY_SET
}

export type SearchFacetsTagAddOrUpdate = {
  payload: {tag: Tag}
  type: SearchActionTypes.SEARCH_FACETS_TAG_ADD_OR_UPDATE
}

// All actions

export type SearchActions =
  | SearchFacetsAddAction
  | SearchFacetsClearAction
  | SearchFacetsRemoveAction
  | SearchFacetsTagAddOrUpdate
  | SearchFacetsUpdateAction
  | SearchQuerySetAction
