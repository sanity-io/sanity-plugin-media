import {SelectIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {
  SearchFacetInputSelectProps,
  SearchFacetInputSelectListItemProps,
  SearchFacetOperatorType
} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {SEARCH_FACET_OPERATORS} from '../../constants'
import {assetsSearchFacetsUpdate} from '../../modules/assets'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: SearchFacetInputSelectProps
}

const SearchFacetSelect: FC<Props> = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()

  const options = facet?.options

  const selectedItem = options?.find(v => v.name === facet?.value)

  const handleListItemClick = (option: SearchFacetInputSelectListItemProps) => {
    dispatch(
      assetsSearchFacetsUpdate({
        name: facet.name,
        value: option.name
      })
    )
  }

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(
      assetsSearchFacetsUpdate({
        name: facet.name,
        operatorType
      })
    )
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
              text={SEARCH_FACET_OPERATORS[selectedOperatorType].label}
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
                      text={SEARCH_FACET_OPERATORS[operatorType].label}
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
