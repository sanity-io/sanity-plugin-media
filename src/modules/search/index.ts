import {type PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit'
import type {MyEpic, SearchFacetInputProps, SearchFacetOperatorType, WithId} from '../../types'
import {EMPTY, of} from 'rxjs'
import {filter, mergeMap, withLatestFrom} from 'rxjs/operators'
import {uuid} from '@sanity/uuid'

import {tagsActions} from '../tags'
import type {RootReducerState} from '../types'

// TODO: don't store non-serializable data in the search store
// (The main offender is `fieldModifier` which is currently a function)

type SearchState = {
  facets: WithId<SearchFacetInputProps>[]
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
      state.facets.push({...action.payload.facet, id: uuid()})
    },
    // Clear all search facets
    facetsClear(state) {
      state.facets = []
    },
    // Remove search facet by name
    facetsRemoveByName(state, action: PayloadAction<{facetName: string}>) {
      state.facets = state.facets.filter(facet => facet.name !== action.payload.facetName)
    },
    // Remove search facet by name
    facetsRemoveByTag(state, action: PayloadAction<{tagId: string}>) {
      state.facets = state.facets.filter(
        facet =>
          !(
            facet.name === 'tag' &&
            facet.type === 'searchable' &&
            (facet.operatorType === 'references' || facet.operatorType === 'doesNotReference') &&
            facet.value?.value === action.payload.tagId
          )
      )
    },
    // Remove search facet by name
    facetsRemoveById(state, action: PayloadAction<{facetId: string}>) {
      state.facets = state.facets.filter(facet => facet.id !== action.payload.facetId)
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

      const facet = state.facets.find(f => f.name === name)

      if (!facet) {
        return
      }

      if (facet.type === 'number' && modifier) {
        facet.modifier = modifier
      }
      if (operatorType) {
        facet.operatorType = operatorType
      }
      if (typeof value !== 'undefined') {
        facet.value = value
      }

      state.facets = state.facets.filter(f => f.name !== facet.name || f.id === facet.id)
    },
    // Update an existing search facet
    facetsUpdateById(
      state,
      action: PayloadAction<{
        modifier?: string
        id: string
        operatorType?: SearchFacetOperatorType
        value?: any // TODO: type correctly
      }>
    ) {
      const {modifier, id, operatorType, value} = action.payload

      state.facets.forEach((facet, index) => {
        if (facet.id === id) {
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

      return EMPTY
    })
  )

// Selectors
export const selectIsSearchFacetTag = createSelector(
  [
    (state: RootReducerState) => state.search.facets,
    (_state: RootReducerState, tagId: string) => tagId
  ],
  (searchFacets, tagId) =>
    searchFacets.some(
      facet =>
        facet.name === 'tag' &&
        facet.type === 'searchable' &&
        (facet.operatorType === 'references' || facet.operatorType === 'doesNotReference') &&
        facet.value?.value === tagId
    )
)

export const searchActions = {...searchSlice.actions}

export default searchSlice.reducer
