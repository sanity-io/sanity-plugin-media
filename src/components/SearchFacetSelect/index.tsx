import {SelectIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {SearchFacetSelectProps, SearchFacetSelectListItemProps, LogicalOperator} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {LOGICAL_OPERATOR_MENU_ITEMS_DEFAULT, LOGICAL_OPERATOR_MAPPING} from '../../constants'
import {assetsSearchFacetsUpdate} from '../../modules/assets'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: SearchFacetSelectProps
}

const SearchFacetSelect: FC<Props> = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()

  const list = facet?.options?.list
  const logicalNot = facet?.options?.logical ?? true

  const selectedItem = list?.find(v => v.name === facet?.value)

  const handleListItemClick = (list: SearchFacetSelectListItemProps) => {
    dispatch(
      assetsSearchFacetsUpdate({
        ...facet,
        value: list.name
      })
    )
  }

  const handleLogicalOperatorItemClick = (operator: LogicalOperator) => {
    dispatch(
      assetsSearchFacetsUpdate({
        ...facet,
        operators: {
          ...facet.operators,
          logical: operator
        }
      })
    )
  }

  const selectedLogicalOperator = facet?.operators?.logical ?? 'is'

  return (
    <SearchFacet facet={facet}>
      {/* Logical NOT */}
      {logicalNot && (
        <MenuButton
          button={
            <Button
              fontSize={1}
              iconRight={SelectIcon}
              padding={2} //
              style={{
                marginRight: '4px'
              }}
              text={LOGICAL_OPERATOR_MAPPING[selectedLogicalOperator]}
            />
          }
          id="operators"
          menu={
            <Menu>
              {LOGICAL_OPERATOR_MENU_ITEMS_DEFAULT?.map((operator, index) => {
                if (operator) {
                  return (
                    <MenuItem
                      disabled={operator === selectedLogicalOperator}
                      key={operator}
                      onClick={() => handleLogicalOperatorItemClick(operator)}
                      text={LOGICAL_OPERATOR_MAPPING[operator]}
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
            tone="primary"
          />
        }
        id="list"
        menu={
          <Menu>
            {list?.map((item, index) => (
              <MenuItem
                disabled={item.name === selectedItem?.name}
                key={item.name}
                onClick={() => handleListItemClick(list[index])}
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
