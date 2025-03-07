import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import type {
  SearchFacetInputNumberModifier,
  SearchFacetInputNumberProps,
  SearchFacetOperatorType,
  WithId
} from '../../types'

import {useDispatch} from 'react-redux'
import {operators} from '../../config/searchFacets'
import {usePortalPopoverProps} from '../../hooks/usePortalPopoverProps'
import {searchActions} from '../../modules/search'
import SearchFacet from '../SearchFacet'
import TextInputNumber from '../TextInputNumber'

type Props = {
  facet: WithId<SearchFacetInputNumberProps>
}

const SearchFacetNumber = ({facet}: Props) => {
  // Redux
  const dispatch = useDispatch()

  const popoverProps = usePortalPopoverProps()

  const modifiers = facet?.modifiers
  const selectedModifier = facet?.modifier
    ? modifiers?.find(modifier => modifier.name === facet?.modifier)
    : modifiers?.[0]

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(searchActions.facetsUpdateById({id: facet.id, operatorType}))
  }

  const handleModifierClick = (modifier: SearchFacetInputNumberModifier) => {
    dispatch(searchActions.facetsUpdateById({id: facet.id, modifier: modifier.name}))
  }

  const handleValueChange = (value: number) => {
    dispatch(searchActions.facetsUpdateById({id: facet.id, value}))
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
              padding={2}
              text={selectedModifier?.title}
            />
          }
          id="modifier"
          menu={
            <Menu>
              {modifiers.map(modifier => {
                const selected = modifier.name === facet.modifier
                return (
                  <MenuItem
                    disabled={selected}
                    fontSize={1}
                    key={modifier.name}
                    onClick={() => handleModifierClick(modifier)}
                    padding={2}
                    text={modifier.title}
                  />
                )
              })}
            </Menu>
          }
          popover={popoverProps}
        />
      )}
    </SearchFacet>
  )
}

export default SearchFacetNumber
