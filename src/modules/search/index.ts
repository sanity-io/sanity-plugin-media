import {createSelector} from '@reduxjs/toolkit'
import {
  SearchFacetInputProps,
  SearchFacetInputSearchableProps,
  SearchFacetOperatorType,
  Tag
} from '@types'
import produce from 'immer'
import {Selector} from 'react-redux'
import {StateObservable} from 'redux-observable'
import {empty, of, Observable} from 'rxjs'
import {filter, mergeMap, withLatestFrom} from 'rxjs/operators'
import {isOfType} from 'typesafe-actions'

import {TagsActions} from '../tags/types'
import {TagsActionTypes} from '../tags'
import {RootReducerState} from '../types'
import {
  SearchActions,
  SearchReducerState,
  SearchSearchFacetTagAddOrUpdate,
  SearchSearchFacetsAddAction,
  SearchSearchFacetsClearAction,
  SearchSearchFacetsRemoveAction,
  SearchSearchFacetsUpdateAction,
  SearchSetSearchQueryAction
} from './types'

/***********
 * ACTIONS *
 ***********/

export enum SearchActionTypes {
  SEARCH_FACETS_ADD = 'SEARCH_SEARCH_FACET_ADD',
  SEARCH_FACETS_CLEAR = 'SEARCH_SEARCH_FACET_CLEAR',
  SEARCH_FACETS_REMOVE = 'SEARCH_SEARCH_FACET_REMOVE',
  SEARCH_FACETS_UPDATE = 'SEARCH_SEARCH_FACET_UPDATE',
  SEARCH_FACET_TAG_ADD_OR_UPDATE = 'SEARCH_SEARCH_FACET_TAG_ADD_OR_UPDATE',
  SET_SEARCH_QUERY = 'SEARCH_SET_SEARCH_QUERY'
}

/***********
 * REDUCER *
 ***********/

const initialState: SearchReducerState = {
  searchFacets: [],
  searchQuery: ''
}

export default function searchReducer(
  state: SearchReducerState = initialState,
  action: SearchActions
): SearchReducerState {
  return produce(state, draft => {
    switch (action.type) {
      case SearchActionTypes.SET_SEARCH_QUERY:
        draft.searchQuery = action.payload?.searchQuery
        // draft.pageIndex = 0
        break

      /**
       * A search facet has been added
       */
      case SearchActionTypes.SEARCH_FACETS_ADD:
        draft.searchFacets.push(action.payload.facet)
        break
      /**
       * All search facet have been clear
       */
      case SearchActionTypes.SEARCH_FACETS_CLEAR:
        draft.searchFacets = []
        break
      /**
       * A single search facet has been removed
       */
      case SearchActionTypes.SEARCH_FACETS_REMOVE:
        draft.searchFacets = draft.searchFacets.filter(
          facet => facet.name !== action.payload.facetName
        )
        break
      /**
       * A single search facet has been updated
       */
      case SearchActionTypes.SEARCH_FACETS_UPDATE: {
        const {modifier, name, operatorType, value} = action.payload

        draft.searchFacets.forEach((facet, index) => {
          if (facet.name === name) {
            if (facet.type === 'number' && modifier) {
              facet.modifier = modifier
            }
            if (operatorType) {
              facet.operatorType = operatorType
            }
            if (typeof value !== 'undefined') {
              draft.searchFacets[index].value = value
            }
          }
        })
        break
      }

      case SearchActionTypes.SEARCH_FACET_TAG_ADD_OR_UPDATE: {
        const tag = action?.payload?.tag
        const searchFacetTagIndex = draft.searchFacets.findIndex(facet => facet.name === 'tag')

        // TODO: DRY
        const searchFacet = {
          contexts: 'all',
          field: 'opt.media.tags',
          name: 'tag',
          operatorType: 'references',
          operatorTypes: ['references', 'doesNotReference', null, 'empty', 'notEmpty'],
          title: 'Tags',
          type: 'searchable',
          value: {
            label: tag?.name?.current,
            value: tag?._id
          }
        } as SearchFacetInputSearchableProps

        if (searchFacetTagIndex >= 0) {
          draft.searchFacets[searchFacetTagIndex] = searchFacet
        } else {
          draft.searchFacets.push(searchFacet as SearchFacetInputSearchableProps)
        }

        break
      }
      default:
        break
    }
    return draft
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// Set search query
export const searchSetSearchQuery = (searchQuery: string): SearchSetSearchQueryAction => ({
  payload: {searchQuery},
  type: SearchActionTypes.SET_SEARCH_QUERY
})

// Add search facet
export const searchSearchFacetsAdd = (
  facet: SearchFacetInputProps
): SearchSearchFacetsAddAction => ({
  payload: {facet},
  type: SearchActionTypes.SEARCH_FACETS_ADD
})

// Clear search facets
export const searchSearchFacetsClear = (): SearchSearchFacetsClearAction => ({
  type: SearchActionTypes.SEARCH_FACETS_CLEAR
})

// Remove search facet
export const assetsSearchFacetsRemove = (facetName: string): SearchSearchFacetsRemoveAction => ({
  payload: {facetName},
  type: SearchActionTypes.SEARCH_FACETS_REMOVE
})

// Update search facet
export const searchSearchFacetsUpdate = ({
  modifier,
  name,
  operatorType,
  value
}: {
  modifier?: string
  name: string
  operatorType?: SearchFacetOperatorType
  value?: any // TODO: type correctly
}): SearchSearchFacetsUpdateAction => ({
  payload: {
    modifier,
    name,
    operatorType,
    value
  },
  type: SearchActionTypes.SEARCH_FACETS_UPDATE
})

// Add or update existing tag search facet
export const searchSearchFacetTagAddOrUpdate = (tag: Tag): SearchSearchFacetTagAddOrUpdate => ({
  payload: {tag},
  type: SearchActionTypes.SEARCH_FACET_TAG_ADD_OR_UPDATE
})

/*********
 * EPICS *
 *********/

/**
 * Listen for tag delete completions:
 * - clear tag search facet (if present and set to the recently deleted tag)
 */
export const searchSearchFacetTagRemoveEpic = (
  action$: Observable<TagsActions>,
  state$: StateObservable<RootReducerState>
): Observable<SearchActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.DELETE_COMPLETE)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const currentSearchFacetTag = state.search.searchFacets?.find(facet => facet.name === 'tag')

      if (currentSearchFacetTag?.type === 'searchable') {
        if (currentSearchFacetTag.value?.value === action?.payload?.tagId) {
          return of(assetsSearchFacetsRemove('tag'))
        }
      }

      return empty()
    })
  )

/**
 * Listen for tag update completions:
 * - update tag search facet (if present and set to the recently deleted tag)
 */
export const searchSearchFacetTagUpdateEpic = (
  action$: Observable<TagsActions>,
  state$: StateObservable<RootReducerState>
): Observable<SearchActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.UPDATE_COMPLETE)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {tagId} = action.payload

      const currentSearchFacetTag = state.search.searchFacets?.find(facet => facet.name === 'tag')
      const tagItem = state.tags.byIds[tagId]

      if (currentSearchFacetTag?.type === 'searchable') {
        if (currentSearchFacetTag.value?.value === tagId) {
          return of(
            searchSearchFacetsUpdate({
              name: 'tag',
              value: {
                label: tagItem?.tag?.name?.current,
                value: tagItem?.tag?._id
              }
            })
          )
        }
      }

      return empty()
    })
  )

/*************
 * SELECTORS *
 *************/

export const selectHasSearchFacetTag: Selector<RootReducerState, boolean> = createSelector(
  state => state.search.searchFacets,
  searchFacets => !!searchFacets?.find(facet => facet.name === 'tag')?.value
)

export const selectIsSearchFacetTag = createSelector(
  [
    (state: RootReducerState) => state.tags.byIds,
    state => state.search.searchFacets,
    (_state: RootReducerState, tagId: string) => tagId
  ],
  (tagsByIds, searchFacets, tagId) => {
    const searchFacet = searchFacets?.find(facet => facet.name === 'tag')

    if (searchFacet?.type === 'searchable') {
      const searchFacetTagId = searchFacet.value?.value
      if (searchFacetTagId) {
        return (
          tagsByIds[searchFacetTagId]?.tag?._id === tagId &&
          searchFacet?.operatorType === 'references'
        )
      }
    }

    return false
  }
)
