import {AddCircleIcon} from '@sanity/icons'
import {Button, Flex, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem} from '@sanity/ui'
import {SearchFacetDivider, SearchFacetGroup, SearchFacetInputProps} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {FACETS} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {facetsAdd, facetsClear} from '../../modules/search'

const SearchFacetsControl: FC = () => {
  // Redux
  const dispatch = useDispatch()
  const searchFacets = useTypedSelector(state => state.search.facets)
  const document = useTypedSelector(state => state.document)

  const isTool = !document

  // Manually filter facets based on current context, whether it's invoked as a tool, or via selection through
  // via custom asset source.
  const filteredFacets = FACETS.filter(facet => {
    if (facet.type === 'group' || facet.type === 'divider') {
      return true
    }

    if (facet.contexts === 'all') {
      return true
    }

    if (isTool) {
      return facet.contexts.includes('tool')
    } else {
      // TODO: in future, determine whether we're inserting into a file or image field.
      // For now, it's only possible to insert into image fields.
      return facet.contexts.includes('image')
    }
  })

  // Determine if there are any remaining facets
  // (This operates under the assumption that only one of each facet can be active at any given time)
  const remainingSearchFacets =
    filteredFacets.filter(facet => facet).length - searchFacets.length > 0

  const renderMenuFacets = (
    facets: (SearchFacetDivider | SearchFacetGroup | SearchFacetInputProps)[]
  ) => {
    return (
      <>
        {facets?.map((facet, index) => {
          if (facet.type === 'divider') {
            return <MenuDivider key={index} />
          }

          // Recursively render menu facets
          if (facet.type === 'group') {
            return <MenuGroup title={facet.title}>{renderMenuFacets(facet.facets)}</MenuGroup>
          }

          if (facet) {
            const isPresent = !!searchFacets.find(v => v.name === facet.name)

            return (
              <MenuItem
                disabled={isPresent}
                fontSize={1}
                key={facet.name}
                onClick={() => dispatch(facetsAdd({facet}))}
                padding={2}
                text={facet.title}
              />
            )
          }
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
            disabled={!remainingSearchFacets}
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
      />

      {/* Clear facets button */}
      {searchFacets.length > 0 && (
        <Button fontSize={1} mode="bleed" onClick={() => dispatch(facetsClear())} text="Clear" />
      )}
    </Flex>
  )
}

export default SearchFacetsControl
