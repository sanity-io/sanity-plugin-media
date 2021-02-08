import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem, TextInput} from '@sanity/ui'
import {SearchFacetInputStringProps, SearchFacetOperatorType} from '@types'
import React, {ChangeEvent, FC} from 'react'
import {useDispatch} from 'react-redux'

import {SEARCH_FACET_OPERATORS} from '../../constants'
import {assetsSearchFacetsUpdate} from '../../modules/assets'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: SearchFacetInputStringProps
}

const SearchFacetString: FC<Props> = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(
      assetsSearchFacetsUpdate({
        name: facet.name,
        operatorType
      })
    )
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      assetsSearchFacetsUpdate({
        name: facet.name,
        value: e.target.value
      })
    )
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

      {/* Value */}
      {!SEARCH_FACET_OPERATORS[selectedOperatorType].hideInput && (
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
