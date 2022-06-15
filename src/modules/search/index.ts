import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {MyEpic, SearchFacetInputProps, SearchFacetOperatorType} from '@types'
import {Selector} from 'react-redux'
import {empty, of} from 'rxjs'
import {filter, mergeMap, withLatestFrom} from 'rxjs/operators'
import {tagsActions} from '../tags'
import type {RootReducerState} from '../types'

// TODO: don't store non-serializable data in the search store
// (The main offender is `fieldModifier` which is currently a function)

type SearchState = {
  facets: SearchFacetInputProps[]
  query: string
}

const initialState = {
  facets: [],
  query: ''
} as SearchState

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Add search facet
    facetsAdd(state, action: PayloadAction<{facet: SearchFacetInputProps}>) {
      state.facets.push(action.payload.facet)
    },
    // Clear all search facets
    facetsClear(state) {
      state.facets = []
    },
    // Remove search facet by name
    facetsRemove(state, action: PayloadAction<{facetName: string}>) {
      state.facets = state.facets.filter(facet => facet.name !== action.payload.facetName)
    },
    // Update an existing search facet
    facetsUpdate(
      state,
      action: PayloadAction<{
        modifier?: string
        name: string
        operatorType?: SearchFacetOperatorType
        value?: any // TODO: type correctly
      }>
    ) {
      const {modifier, name, operatorType, value} = action.payload

      state.facets.forEach((facet, index) => {
        if (facet.name === name) {
          if (facet.type === 'number' && modifier) {
            facet.modifier = modifier
          }
          if (operatorType) {
            facet.operatorType = operatorType
          }
          if (typeof value !== 'undefined') {
            state.facets[index].value = value
          }
        }
      })
    },
    // Update existing search query
    querySet(state, action: PayloadAction<{searchQuery: string}>) {
      state.query = action.payload?.searchQuery
    }
  }
})

// Epics

// On tag update success -> update existing tag search facet (if present)
export const searchFacetTagUpdateEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(tagsActions.updateComplete.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {tag} = action.payload

      const currentSearchFacetTag = state.search.facets?.find(facet => facet.name === 'tag')
      const tagItem = state.tags.byIds[tag._id]

      if (currentSearchFacetTag?.type === 'searchable') {
        if (currentSearchFacetTag.value?.value === tag._id) {
          return of(
            searchSlice.actions.facetsUpdate({
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

// Selectors

export const selectHasSearchFacetTag: Selector<RootReducerState, boolean> = createSelector(
  (state: RootReducerState) => state.search.facets,
  searchFacets => !!searchFacets?.find(facet => facet.name === 'tag')
)

export const selectIsSearchFacetTag = createSelector(
  [
    (state: RootReducerState) => state.tags.byIds,
    (state: RootReducerState) => state.search.facets,
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

export const searchActions = searchSlice.actions

export default searchSlice.reducer
