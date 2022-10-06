import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {
  SearchFacetInputNumberModifier,
  SearchFacetInputNumberProps,
  SearchFacetOperatorType
} from '@types'
import React from 'react'
import {useDispatch} from 'react-redux'
import {operators} from '../../config/searchFacets'
import {searchActions} from '../../modules/search'
import SearchFacet from '../SearchFacet'
import TextInputNumber from '../TextInputNumber'

type Props = {
  facet: SearchFacetInputNumberProps
}

const SearchFacetNumber = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()

  const modifiers = facet?.modifiers
  const selectedModifier = facet?.modifier
    ? modifiers?.find(modifier => modifier.name === facet?.modifier)
    : modifiers?.[0]

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(searchActions.facetsUpdate({name: facet.name, operatorType}))
  }

  const handleModifierClick = (modifier: SearchFacetInputNumberModifier) => {
    dispatch(searchActions.facetsUpdate({name: facet.name, modifier: modifier.name}))
  }

  const handleValueChange = (value: number) => {
    dispatch(searchActions.facetsUpdate({name: facet.name, value}))
  }

  const selectedOperatorType: SearchFacetOperatorType = facet.operatorType ?? 'greaterThan'

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
            />
          }
          id="modifier"
          menu={
            <Menu>
              {modifiers.map(modifier => (
                <MenuItem
                  disabled={modifier.name === facet.modifier}
                  fontSize={1}
                  key={modifier.name}
                  onClick={() => handleModifierClick(modifier)}
                  padding={2}
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
