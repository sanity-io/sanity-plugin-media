import {AddCircleIcon, EditIcon, ResetIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {FACETS} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsSearchFacetsAdd, assetsSearchFacetsClear} from '../../modules/assets'
import SearchFacetNumber from '../SearchFacetNumber'
import SearchFacetSelect from '../SearchFacetSelect'

const SearchFacets: FC = () => {
  // Redux
  const dispatch = useDispatch()
  const searchFacets = useTypedSelector(state => state.assets.searchFacets)

  // Determine if there are any remaining facets
  // (This operates under the assumption that only one of each facet can be active at any given time)
  const remainingSearchFacets = FACETS.filter(facet => facet).length - searchFacets.length > 0

  return (
    <>
      <Box display={['none', 'none', 'none', 'block']}>
        <Inline space={2}>
          {/* TODO: understand why this double nesting of <Inline /> is required */}
          <Inline space={2}>
            {searchFacets.map(facet => {
              if (facet.type === 'number') {
                return <SearchFacetNumber facet={facet} key={facet.name} />
              }

              if (facet.type === 'select') {
                return <SearchFacetSelect facet={facet} key={facet.name} />
              }

              return null
            })}
          </Inline>

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
                          key={facet.name}
                          onClick={() => dispatch(assetsSearchFacetsAdd(facet))}
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
                icon={ResetIcon}
                // mode="ghost"
                mode="bleed"
                onClick={() => dispatch(assetsSearchFacetsClear())}
                text="Reset"
              />
            )}
          </Flex>
        </Inline>
      </Box>
      <Box display={['block', 'block', 'block', 'none']}>
        <Button fontSize={1} icon={EditIcon} mode="ghost" text="Filters (2)" tone="primary" />
      </Box>
    </>
  )
}

export default SearchFacets
