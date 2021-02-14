import {hues} from '@sanity/color'
import {ArrowDownIcon, ArrowUpIcon, CloseIcon, EditIcon, SearchIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Flex, Text} from '@sanity/ui'
import {SearchFacetInputSearchableProps, Tag, TagActions, TagItem} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {inputs} from '../../config/searchFacets'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {searchActions, selectHasSearchFacetTag, selectIsSearchFacetTag} from '../../modules/search'

type Props = {
  actions?: TagActions[]
  tag: TagItem
}

const Container = styled(Flex)``

const ButtonContainer = styled(Flex)`
  @media (pointer: fine) {
    visibility: hidden;
  }

  @media (hover: hover) and (pointer: fine) {
    ${Container}:hover & {
      visibility: visible;
    }
  }
`

const Tag: FC<Props> = (props: Props) => {
  const {actions, tag} = props

  // Redux
  const dispatch = useDispatch()
  const assetsPicked = useTypedSelector(selectAssetsPicked)
  const hasSearchFacetTag = useTypedSelector(selectHasSearchFacetTag)
  const isSearchFacetTag = useTypedSelector(state => selectIsSearchFacetTag(state, tag?.tag?._id))

  // Callbacks
  const handleSearchFacetTagRemove = () => {
    dispatch(searchActions.facetsRemove({facetName: 'tag'}))
  }

  const handleShowAddTagToAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsTagAdd({assetsPicked, tag: tag.tag}))
  }

  const handleShowRemoveTagFromAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsTagRemove({assetsPicked, tag: tag.tag}))
  }

  const handleShowTagDeleteDialog = () => {
    dispatch(dialogActions.showConfirmDeleteTag({tag: tag.tag}))
  }

  const handleShowTagEditDialog = () => {
    dispatch(dialogActions.showTagEdit({tagId: tag?.tag?._id}))
  }

  const handleSearchFacetTagAddOrUpdate = () => {
    const searchFacet = {
      ...inputs.tag,
      value: {
        label: tag?.tag?.name?.current,
        value: tag?.tag?._id
      }
    } as SearchFacetInputSearchableProps

    if (hasSearchFacetTag) {
      dispatch(
        searchActions.facetsUpdate({
          name: 'tag',
          operatorType: 'includes',
          value: searchFacet.value
        })
      )
    } else {
      dispatch(searchActions.facetsAdd({facet: searchFacet}))
    }
  }

  return (
    <Container align="center" justify="space-between">
      <Box flex={1} paddingY={3}>
        <Text
          size={1}
          style={{
            color: tag?.updating ? hues.gray[800].hex : hues.gray[500].hex,
            userSelect: 'none'
          }}
          textOverflow="ellipsis"
        >
          {tag?.tag?.name?.current}
        </Text>
      </Box>

      <ButtonContainer align="center" style={{flexShrink: 0}}>
        {/* Apply to all */}
        {actions?.includes('applyAll') && (
          <Button
            disabled={tag?.updating}
            fontSize={1}
            icon={ArrowUpIcon}
            mode="bleed"
            onClick={handleShowAddTagToAssetsDialog}
            padding={2}
            style={{
              background: 'none',
              boxShadow: 'none'
            }}
            tone="primary"
          />
        )}

        {/* Remove from all */}
        {actions?.includes('removeAll') && (
          <Button
            disabled={tag?.updating}
            fontSize={1}
            icon={ArrowDownIcon}
            mode="bleed"
            onClick={handleShowRemoveTagFromAssetsDialog}
            padding={2}
            style={{
              background: 'none',
              boxShadow: 'none'
            }}
            tone="primary"
          />
        )}

        {/* Search facet toggle */}
        {actions?.includes('search') && (
          <Button
            disabled={tag?.updating}
            fontSize={1}
            icon={isSearchFacetTag ? CloseIcon : SearchIcon}
            mode="bleed"
            onClick={
              isSearchFacetTag ? handleSearchFacetTagRemove : handleSearchFacetTagAddOrUpdate
            }
            padding={2}
            style={{
              background: 'none',
              boxShadow: 'none',
              opacity: 0.5
            }}
          />
        )}
        {/* Edit icon */}
        {actions?.includes('edit') && (
          <Button
            disabled={tag?.updating}
            fontSize={1}
            icon={EditIcon}
            mode="bleed"
            muted
            onClick={handleShowTagEditDialog}
            padding={2}
            style={{
              background: 'none',
              boxShadow: 'none',
              opacity: 0.5
            }}
          />
        )}
        {/* Delete icon */}
        {actions?.includes('delete') && (
          <Button
            disabled={tag?.updating}
            fontSize={1}
            icon={TrashIcon}
            mode="bleed"
            onClick={handleShowTagDeleteDialog}
            padding={2}
            style={{
              background: 'none',
              boxShadow: 'none'
            }}
            tone="critical"
          />
        )}
      </ButtonContainer>
    </Container>
  )
}

export default Tag
