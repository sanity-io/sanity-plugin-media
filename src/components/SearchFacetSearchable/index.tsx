import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {ReactSelectOption, SearchFacetInputSearchableProps, SearchFacetOperatorType} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import Select from 'react-select'

import {SEARCH_FACET_OPERATORS} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsSearchFacetsUpdate} from '../../modules/assets'
import {reactSelectComponents, reactSelectStyles} from '../../styled/react-select/single'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: SearchFacetInputSearchableProps
}

const SearchFacetSearchable: FC<Props> = (props: Props) => {
  const {facet} = props

  // Redux
  const dispatch = useDispatch()
  const tagIds = useTypedSelector(state => state.tags.allIds)
  const tagsByIds = useTypedSelector(state => state.tags.byIds)

  const allTagOptions = tagIds.reduce((acc: ReactSelectOption[], id) => {
    const tag = tagsByIds[id]?.tag

    if (tag) {
      acc.push({
        label: tag?.name?.current,
        value: tag?._id
      })
    }

    return acc
  }, [])

  const handleChange = (option: ReactSelectOption) => {
    dispatch(
      assetsSearchFacetsUpdate({
        ...facet,
        value: option
      })
    )
  }

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(
      assetsSearchFacetsUpdate({
        ...facet,
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
        <Box marginX={1} style={{width: '140px'}}>
          <Select
            components={reactSelectComponents}
            instanceId="facet-searchable"
            isClearable
            isSearchable
            menuPortalTarget={document.body}
            name="tags-x"
            noOptionsMessage={() => 'No tags'}
            onChange={value => handleChange(value as ReactSelectOption)}
            options={allTagOptions}
            placeholder="Select..."
            styles={reactSelectStyles}
            value={facet?.value}
          />
        </Box>
      )}
    </SearchFacet>
  )
}

export default SearchFacetSearchable
