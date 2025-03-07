import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem, TextInput} from '@sanity/ui'
import type {SearchFacetInputStringProps, SearchFacetOperatorType, WithId} from '../../types'
import {type ChangeEvent} from 'react'
import {useDispatch} from 'react-redux'

import {operators} from '../../config/searchFacets'
import {usePortalPopoverProps} from '../../hooks/usePortalPopoverProps'
import {searchActions} from '../../modules/search'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: WithId<SearchFacetInputStringProps>
}

const SearchFacetString = ({facet}: Props) => {
  // Redux
  const dispatch = useDispatch()

  const popoverProps = usePortalPopoverProps()

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(searchActions.facetsUpdateById({id: facet.id, operatorType}))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(searchActions.facetsUpdateById({id: facet.id, value: e.target.value}))
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
              padding={2}
              text={operators[selectedOperatorType].label}
            />
          }
          id="operators"
          menu={
            <Menu>
              {facet.operatorTypes.map((operatorType, index) => {
                if (operatorType) {
                  const selected = operatorType === selectedOperatorType
                  return (
                    <MenuItem
                      disabled={selected}
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
          popover={popoverProps}
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
