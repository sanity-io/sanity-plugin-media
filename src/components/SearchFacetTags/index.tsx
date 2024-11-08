import {SelectIcon} from '@sanity/icons'
import {Box, Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {
  SearchFacetInputSearchableProps,
  SearchFacetOperatorType,
  TagSelectOption,
  WithId
} from '@types'
import {useDispatch} from 'react-redux'
import Select from 'react-select'
import {useColorScheme} from 'sanity'
import {operators} from '../../config/searchFacets'
import {PROJECT_DOCUMENT_NAME, TAG_DOCUMENT_NAME} from '../../constants'
import {usePortalPopoverProps} from '../../hooks/usePortalPopoverProps'
import useTypedSelector from '../../hooks/useTypedSelector'
import {searchActions} from '../../modules/search'
import {selectTags} from '../../modules/tags'
import {reactSelectComponents, reactSelectStyles} from '../../styled/react-select/single'
import getTagSelectOptions from '../../utils/getTagSelectOptions'
import SearchFacet from '../SearchFacet'

type Props = {
  facet: WithId<SearchFacetInputSearchableProps>
}

const SearchFacetTags = ({facet}: Props) => {
  const {scheme} = useColorScheme()

  const panelType = facet.name === 'project' ? PROJECT_DOCUMENT_NAME : TAG_DOCUMENT_NAME

  // Redux
  const dispatch = useDispatch()
  let tags = useTypedSelector(state => selectTags(state))
  tags = tags.filter(tag => tag.tag._type === panelType)

  const tagsFetching = useTypedSelector(state => state.tags.fetching)
  const allTagOptions = getTagSelectOptions(tags)

  const popoverProps = usePortalPopoverProps()

  const handleChange = (option: TagSelectOption) => {
    dispatch(
      searchActions.facetsUpdateById({
        id: facet.id,
        value: option
      })
    )
  }

  const handleOperatorItemClick = (operatorType: SearchFacetOperatorType) => {
    dispatch(
      searchActions.facetsUpdateById({
        id: facet.id,
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
                      space={4}
                      style={{minWidth: '150px'}}
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
        <Box marginX={1} style={{width: 'fit-content', minWidth: '210px'}}>
          <Select
            components={reactSelectComponents}
            instanceId="facet-searchable"
            isClearable
            isDisabled={tagsFetching}
            isSearchable
            name="tags"
            noOptionsMessage={() => `No ${facet.name === 'project' ? 'projects' : 'tags'}`}
            onChange={value => handleChange(value as TagSelectOption)}
            options={allTagOptions}
            placeholder={tagsFetching ? 'Loading...' : 'Select...'}
            styles={reactSelectStyles(scheme)}
            value={facet?.value}
          />
        </Box>
      )}
    </SearchFacet>
  )
}

export default SearchFacetTags
