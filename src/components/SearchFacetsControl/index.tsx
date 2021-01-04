import {AddCircleIcon} from '@sanity/icons'
import {Button, Flex, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {FACETS} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsSearchFacetsAdd, assetsSearchFacetsClear} from '../../modules/assets'

const SearchFacetsControl: FC = () => {
  // Redux
  const dispatch = useDispatch()
  const searchFacets = useTypedSelector(state => state.assets.searchFacets)

  // Determine if there are any remaining facets
  // (This operates under the assumption that only one of each facet can be active at any given time)
  const remainingSearchFacets = FACETS.filter(facet => facet).length - searchFacets.length > 0

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
            // mode="ghost"
            text="Add filter"
            tone="primary"
          />
        }
        id="facets"
        menu={
          <Menu>
            {FACETS?.map((facet, index) => {
              if (facet) {
                const isPresent = !!searchFacets.find(v => v.name === facet.name)

                return (
                  <MenuItem
                    disabled={isPresent}
                    fontSize={1}
                    key={facet.name}
                    onClick={() => dispatch(assetsSearchFacetsAdd(facet))}
                    padding={2}
                    text={facet.title}
                  />
                )
              }

              return <MenuDivider key={index} />
            })}
          </Menu>
        }
      />

      {/* Clear facets button */}
      {searchFacets.length > 0 && (
        <Button
          fontSize={1}
          // mode="ghost"
          mode="bleed"
          onClick={() => dispatch(assetsSearchFacetsClear())}
          text="Clear"
        />
      )}
    </Flex>
  )
}

export default SearchFacetsControl
