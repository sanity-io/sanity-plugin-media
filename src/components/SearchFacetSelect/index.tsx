import {SelectIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {
  SearchFacetInputSelectListItemProps,
  SearchFacetInputSelectProps,
  SearchFacetOperatorType
} from '@types'
import React from 'react'
import {useDispatch} from 'react-redux'

import {operators} from '../../config/searchFacets'
import {searchActions} from '../../modules/search'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: SearchFacetInputSelectProps
}

const SearchFacetSelect = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()

  const options = facet?.options

  const selectedItem = options?.find(v => v.name === facet?.value)

  const handleListItemClick = (option: SearchFacetInputSelectListItemProps) => {
    dispatch(searchActions.facetsUpdate({name: facet.name, value: option.name}))
  }

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(searchActions.facetsUpdate({name: facet.name, operatorType}))
  }

  const selectedOperatorType: SearchFacetOperatorType = facet?.operatorType ?? 'is'

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
              style={{
                marginRight: '4px'
              }}
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

      {/* List */}
      <MenuButton
        button={
          <Button
            fontSize={1}
            iconRight={SelectIcon}
            padding={2} //
            text={selectedItem?.title}
          />
        }
        id="list"
        menu={
          <Menu>
            {options?.map((item, index) => (
              <MenuItem
                disabled={item.name === selectedItem?.name}
                fontSize={1}
                key={item.name}
                onClick={() => handleListItemClick(options[index])}
                padding={2}
                text={item.title}
              />
            ))}
          </Menu>
        }
      />
    </SearchFacet>
  )
}

export default SearchFacetSelect
