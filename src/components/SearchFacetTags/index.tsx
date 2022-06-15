import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {ReactSelectOption, SearchFacetInputSearchableProps, SearchFacetOperatorType} from '@types'
import React from 'react'
import {useDispatch} from 'react-redux'
import Select from 'react-select'
import {operators} from '../../config/searchFacets'
import useTypedSelector from '../../hooks/useTypedSelector'
import {searchActions} from '../../modules/search'
import {selectTags} from '../../modules/tags'
import {reactSelectComponents, reactSelectStyles} from '../../styled/react-select/single'
import getTagSelectOptions from '../../utils/getTagSelectOptions'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: SearchFacetInputSearchableProps
}

const SearchFacetTags = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()
  const tags = useTypedSelector(state => selectTags(state))
  const tagsFetching = useTypedSelector(state => state.tags.fetching)
  const allTagOptions = getTagSelectOptions(tags)

  const handleChange = (option: ReactSelectOption) => {
    dispatch(
      searchActions.facetsUpdate({
        name: facet.name,
        value: option
      })
    )
  }

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(
      searchActions.facetsUpdate({
        name: facet.name,
        operatorType
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
        <Box marginX={1} style={{width: '160px'}}>
          <Select
            components={reactSelectComponents}
            instanceId="facet-searchable"
            isClearable
            isDisabled={tagsFetching}
            isSearchable
            name="tags"
            noOptionsMessage={() => 'No tags'}
            onChange={value => handleChange(value as ReactSelectOption)}
            options={allTagOptions}
            placeholder={tagsFetching ? 'Loading...' : 'Select...'}
            styles={reactSelectStyles}
            value={facet?.value}
          />
        </Box>
      )}
    </SearchFacet>
  )
}

export default SearchFacetTags
