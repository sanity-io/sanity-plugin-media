import {AddCircleIcon} from '@sanity/icons'
import {Button, Flex, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem} from '@sanity/ui'
import {SearchFacetDivider, SearchFacetGroup, SearchFacetInputProps} from '@types'
import React from 'react'
import {useDispatch} from 'react-redux'
import {FACETS} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {searchActions} from '../../modules/search'

const SearchFacetsControl = () => {
  // Redux
  const dispatch = useDispatch()
  const assetTypes = useTypedSelector(state => state.assets.assetTypes)
  const searchFacets = useTypedSelector(state => state.search.facets)
  const selectedDocument = useTypedSelector(state => state.selected.document)

  const isTool = !selectedDocument

  const filteredFacets = FACETS
    // Filter facets based on current context, whether it's invoked as a tool, or via selection through via custom asset source.
    .filter(facet => {
      if (facet.type === 'group' || facet.type === 'divider') {
        return true
      }

      if (isTool) {
        return !facet?.selectOnly
      }

      const matchingAssetTypes = facet.assetTypes.filter(assetType =>
        assetTypes.includes(assetType)
      )
      return matchingAssetTypes.length > 0
    })
    // Remove adjacent and leading / trailing dividers
    .filter((facet, index, facets) => {
      const previousFacet = facets[index - 1]
      // Ignore leading + trailing dividers
      if (facet.type === 'divider' && (index === 0 || index === facets.length - 1)) {
        return false
      }
      // Ignore adjacent dividers
      if (facet.type === 'divider' && previousFacet?.type === 'divider') {
        return false
      }
      return true
    })

  // Determine if there are any remaining un-selected facets
  // (This operates under the assumption that only one of each facet can be active at any given time)
  const hasRemainingSearchFacets =
    filteredFacets.filter(facet => facet).length - searchFacets.length > 0

  const renderMenuFacets = (
    facets: (SearchFacetDivider | SearchFacetGroup | SearchFacetInputProps)[],
    level: number = 0
  ) => {
    return (
      <>
        {facets?.map((facet, index) => {
          if (facet.type === 'divider') {
            return <MenuDivider key={index} />
          }

          // Recursively render menu facets
          if (facet.type === 'group') {
            return (
              <MenuGroup key={`group-${level}-${index}`} text={facet.title} title={facet.title}>
                {renderMenuFacets(facet.facets, level + 1)}
              </MenuGroup>
            )
          }

          if (facet) {
            const isPresent = !!searchFacets.find(v => v.name === facet.name)

            return (
              <MenuItem
                disabled={isPresent}
                fontSize={1}
                key={facet.name}
                onClick={() => dispatch(searchActions.facetsAdd({facet}))}
                padding={2}
                text={facet.title}
              />
            )
          }

          return null
        })}
      </>
    )
  }

  return (
    <Flex>
      {/* Add filter button */}
      <MenuButton
        button={
          <Button
            disabled={!hasRemainingSearchFacets}
            fontSize={1}
            icon={AddCircleIcon}
            mode="bleed"
            text="Add filter"
            tone="primary"
          />
        }
        id="facets"
        menu={<Menu>{renderMenuFacets(filteredFacets)}</Menu>}
        placement="right-start"
        portal
      />

      {/* Clear facets button */}
      {searchFacets.length > 0 && (
        <Button
          fontSize={1}
          mode="bleed"
          onClick={() => dispatch(searchActions.facetsClear())}
          text="Clear"
        />
      )}
    </Flex>
  )
}

export default SearchFacetsControl
