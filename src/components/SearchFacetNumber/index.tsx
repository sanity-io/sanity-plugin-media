import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {ComparisonOperator, SearchFacetNumberModifier, SearchFacetNumberProps} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {COMPARISON_OPERATOR_MAPPING, COMPARISON_OPERATOR_MENU_ITEMS_DEFAULT} from '../../constants'
import {assetsSearchFacetsUpdate} from '../../modules/assets'
import SearchFacet from '../SearchFacet'
import TextInputNumber from '../TextInputNumber'

type Props = {
  facet: SearchFacetNumberProps
}

const SearchFacetNumber: FC<Props> = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()

  const modifiers = facet?.options?.modifiers
  const selectedModifier = facet?.modifier
    ? modifiers?.find(modifier => modifier.name === facet?.modifier)
    : modifiers?.[0]

  const handleComparisonOperatorItemClick = (operator: ComparisonOperator) => {
    dispatch(
      assetsSearchFacetsUpdate({
        ...facet,
        operators: {
          ...facet.operators,
          comparison: operator
        }
      })
    )
  }

  const handleModifierClick = (modifier: SearchFacetNumberModifier) => {
    dispatch(
      assetsSearchFacetsUpdate({
        ...facet,
        modifier: modifier.name
      })
    )
  }

  const handleValueChange = (value: number) => {
    dispatch(
      assetsSearchFacetsUpdate({
        ...facet,
        value
      })
    )
  }

  const selectedComparisonOperator = facet.operators?.comparison ?? 'gt'

  return (
    <SearchFacet facet={facet}>
      {/* Comparison operators */}
      <MenuButton
        button={
          <Button
            fontSize={1}
            iconRight={SelectIcon}
            padding={2} //
            text={COMPARISON_OPERATOR_MAPPING[selectedComparisonOperator].label}
          />
        }
        id="operators"
        menu={
          <Menu>
            {COMPARISON_OPERATOR_MENU_ITEMS_DEFAULT?.map((operator, index) => {
              if (operator) {
                return (
                  <MenuItem
                    disabled={operator === selectedComparisonOperator}
                    key={operator}
                    onClick={() => handleComparisonOperatorItemClick(operator)}
                    text={COMPARISON_OPERATOR_MAPPING[operator].label}
                  />
                )
              }

              return <MenuDivider key={index} />
            })}
          </Menu>
        }
      />

      {/* Value */}
      <Box marginX={1} style={{maxWidth: '50px'}}>
        <TextInputNumber
          fontSize={1}
          onValueChange={handleValueChange}
          padding={2}
          radius={2}
          width={2}
          value={facet?.value}
        />
      </Box>

      {/* Modifiers */}
      {modifiers && (
        <MenuButton
          button={
            <Button
              fontSize={1}
              iconRight={SelectIcon}
              padding={2} //
              text={selectedModifier?.title}
              tone="primary"
            />
          }
          id="modifier"
          menu={
            <Menu>
              {modifiers.map(modifier => (
                <MenuItem
                  disabled={modifier.name === facet.modifier}
                  key={modifier.name}
                  onClick={() => handleModifierClick(modifier)}
                  text={modifier.title}
                />
              ))}
            </Menu>
          }
        />
      )}
    </SearchFacet>
  )
}

export default SearchFacetNumber
