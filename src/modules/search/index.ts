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
  SearchFacetsTagAddOrUpdate,
  SearchFacetsAddAction,
  SearchFacetsClearAction,
  SearchFacetsRemoveAction,
  SearchFacetsUpdateAction,
  SearchQuerySetAction
} from './types'

/***********
 * ACTIONS *
 ***********/

export enum SearchActionTypes {
  SEARCH_FACETS_ADD = 'SEARCH_FACETS_ADD',
  SEARCH_FACETS_CLEAR = 'SEARCH_FACETS_CLEAR',
  SEARCH_FACETS_REMOVE = 'SEARCH_FACETS_REMOVE',
  SEARCH_FACETS_TAG_ADD_OR_UPDATE = 'SEARCH_FACET_TAG_ADD_OR_UPDATE',
  SEARCH_FACETS_UPDATE = 'SEARCH_FACETS_UPDATE',
  SEARCH_QUERY_SET = 'SEARCH_QUERY_SET'
}

/***********
 * REDUCER *
 ***********/

const initialState: SearchReducerState = {
  facets: [],
  query: ''
}

export default function searchReducer(
  state: SearchReducerState = initialState,
  action: SearchActions
): SearchReducerState {
  return produce(state, draft => {
    switch (action.type) {
      /**
       * A search facet has been added
       */
      case SearchActionTypes.SEARCH_FACETS_ADD:
        draft.facets.push(action.payload.facet)
        break
      /**
       * All search facet have been clear
       */
      case SearchActionTypes.SEARCH_FACETS_CLEAR:
        draft.facets = []
        break
      /**
       * A single search facet has been removed
       */
      case SearchActionTypes.SEARCH_FACETS_REMOVE:
        draft.facets = draft.facets.filter(facet => facet.name !== action.payload.facetName)
        break

      case SearchActionTypes.SEARCH_FACETS_TAG_ADD_OR_UPDATE: {
        const tag = action?.payload?.tag
        const searchFacetTagIndex = draft.facets.findIndex(facet => facet.name === 'tag')

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
          draft.facets[searchFacetTagIndex] = searchFacet
        } else {
          draft.facets.push(searchFacet as SearchFacetInputSearchableProps)
        }

        break
      }

      /**
       * A single search facet has been updated
       */
      case SearchActionTypes.SEARCH_FACETS_UPDATE: {
        const {modifier, name, operatorType, value} = action.payload

        draft.facets.forEach((facet, index) => {
          if (facet.name === name) {
            if (facet.type === 'number' && modifier) {
              facet.modifier = modifier
            }
            if (operatorType) {
              facet.operatorType = operatorType
            }
            if (typeof value !== 'undefined') {
              draft.facets[index].value = value
            }
          }
        })
        break
      }

      case SearchActionTypes.SEARCH_QUERY_SET:
        draft.query = action.payload?.searchQuery
        break

      default:
        break
    }
    return draft
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// Add search facet
export const searchFacetsAdd = (facet: SearchFacetInputProps): SearchFacetsAddAction => ({
  payload: {facet},
  type: SearchActionTypes.SEARCH_FACETS_ADD
})

// Clear search facets
export const searchFacetsClear = (): SearchFacetsClearAction => ({
  type: SearchActionTypes.SEARCH_FACETS_CLEAR
})

// Remove search facet
export const searchFacetsRemove = (facetName: string): SearchFacetsRemoveAction => ({
  payload: {facetName},
  type: SearchActionTypes.SEARCH_FACETS_REMOVE
})

// Update search facet
export const searchFacetsUpdate = ({
  modifier,
  name,
  operatorType,
  value
}: {
  modifier?: string
  name: string
  operatorType?: SearchFacetOperatorType
  value?: any // TODO: type correctly
}): SearchFacetsUpdateAction => ({
  payload: {
    modifier,
    name,
    operatorType,
    value
  },
  type: SearchActionTypes.SEARCH_FACETS_UPDATE
})

// Add or update existing tag search facet
export const searchFacetTagAddOrUpdate = (tag: Tag): SearchFacetsTagAddOrUpdate => ({
  payload: {tag},
  type: SearchActionTypes.SEARCH_FACETS_TAG_ADD_OR_UPDATE
})

// Set search query
export const searchQuerySet = (searchQuery: string): SearchQuerySetAction => ({
  payload: {searchQuery},
  type: SearchActionTypes.SEARCH_QUERY_SET
})

/*********
 * EPICS *
 *********/

/**
 * Listen for tag update completions:
 * - update tag search facet (if present and set to the recently deleted tag)
 */
export const searchFacetTagUpdateEpic = (
  action$: Observable<TagsActions>,
  state$: StateObservable<RootReducerState>
): Observable<SearchActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.UPDATE_COMPLETE)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {tagId} = action.payload

      const currentSearchFacetTag = state.search.facets?.find(facet => facet.name === 'tag')
      const tagItem = state.tags.byIds[tagId]

      if (currentSearchFacetTag?.type === 'searchable') {
        if (currentSearchFacetTag.value?.value === tagId) {
          return of(
            searchFacetsUpdate({
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
  state => state.search.facets,
  searchFacets => !!searchFacets?.find(facet => facet.name === 'tag')?.value
)

export const selectIsSearchFacetTag = createSelector(
  [
    (state: RootReducerState) => state.tags.byIds,
    state => state.search.facets,
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
