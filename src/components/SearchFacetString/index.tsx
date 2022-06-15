import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem, TextInput} from '@sanity/ui'
import {SearchFacetInputStringProps, SearchFacetOperatorType} from '@types'
import React, {ChangeEvent} from 'react'
import {useDispatch} from 'react-redux'

import {operators} from '../../config/searchFacets'
import {searchActions} from '../../modules/search'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: SearchFacetInputStringProps
}

const SearchFacetString = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(searchActions.facetsUpdate({name: facet.name, operatorType}))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(searchActions.facetsUpdate({name: facet.name, value: e.target.value}))
  }

  const selectedOperatorType: SearchFacetOperatorType = facet.operatorType

  return (
    <SearchFacet facet={facet}>
      {/* Optional operators */}
      {facet?.operatorTypes && (
        <MenuButton
          button={
            <Button
              fontSize={1}
              iconRight={SelectIcon}
              padding={2} //
              text={operators[selectedOperatorType].label}
            />
          }
          id="operators"
          menu={
            <Menu>
              {facet.operatorTypes.map((operatorType, index) => {
                if (operatorType) {
                  return (
                    <MenuItem
                      disabled={operatorType === selectedOperatorType}
                      fontSize={1}
                      key={operatorType}
                      onClick={() => handleOperatorItemClick(operatorType)}
                      padding={2}
                      text={operators[operatorType].label}
                    />
                  )
                }

                return <MenuDivider key={index} />
              })}
            </Menu>
          }
        />
      )}

      {/* Value */}
      {!operators[selectedOperatorType].hideInput && (
        <Box marginLeft={1} style={{maxWidth: '125px'}}>
          <TextInput
            fontSize={1}
            onChange={handleChange}
            padding={2}
            radius={2}
            width={2}
            value={facet?.value}
          />
        </Box>
      )}
    </SearchFacet>
  )
}

export default SearchFacetString
