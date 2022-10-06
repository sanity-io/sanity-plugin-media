import {hues} from '@sanity/color'
import {ArrowDownIcon, ArrowUpIcon, CloseIcon, EditIcon, SearchIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Container, Flex, Text, Tooltip} from '@sanity/ui'
import {SearchFacetInputSearchableProps, TagActions, TagItem} from '@types'
import React, {ReactNode} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {inputs} from '../../config/searchFacets'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'
import {searchActions, selectHasSearchFacetTag, selectIsSearchFacetTag} from '../../modules/search'

type Props = {
  actions?: TagActions[]
  tag: TagItem
}

const TagContainer = styled(Flex)`
  height: ${PANEL_HEIGHT}px;
`

const ButtonContainer = styled(Flex)`
  @media (pointer: fine) {
    visibility: hidden;
  }

  @media (hover: hover) and (pointer: fine) {
    ${TagContainer}:hover & {
      visibility: visible;
    }
  }
`

type TagButtonProps = {
  disabled?: boolean
  icon: ReactNode
  onClick: () => void
  tone?: 'critical' | 'primary'
  tooltip: string
}

const TagButton = (props: TagButtonProps) => {
  const {disabled, icon, onClick, tone, tooltip} = props
  return (
    <Tooltip
      content={
        <Container padding={2} width={0}>
          <Text muted size={1}>
            {tooltip}
          </Text>
        </Container>
      }
      disabled={'ontouchstart' in window}
      placement="top"
    >
      <Button
        disabled={disabled}
        fontSize={1}
        icon={icon}
        mode="bleed"
        onClick={onClick}
        padding={2}
        tone={tone}
      />
    </Tooltip>
  )
}

const Tag = (props: Props) => {
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
    dispatch(DIALOG_ACTIONS.showTagEdit({tagId: tag?.tag?._id}))
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
          operatorType: 'references',
          value: searchFacet.value
        })
      )
    } else {
      dispatch(searchActions.facetsAdd({facet: searchFacet}))
    }
  }

  return (
    <TagContainer align="center" flex={1} justify="space-between" paddingLeft={3}>
      <Box flex={1}>
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
        {/* Search facet toggle */}
        {actions?.includes('search') && (
          <TagButton
            disabled={tag?.updating}
            icon={isSearchFacetTag ? <CloseIcon /> : <SearchIcon />}
            onClick={
              isSearchFacetTag ? handleSearchFacetTagRemove : handleSearchFacetTagAddOrUpdate
            }
            tooltip={isSearchFacetTag ? 'Remove filter' : 'Filter by tag'}
          />
        )}
        {/* Edit icon */}
        {actions?.includes('edit') && (
          <TagButton
            disabled={tag?.updating}
            icon={<EditIcon />}
            onClick={handleShowTagEditDialog}
            tone="primary"
            tooltip="Edit tag"
          />
        )}
        {/* Apply to all */}
        {actions?.includes('applyAll') && (
          <TagButton
            disabled={tag?.updating}
            icon={<ArrowUpIcon />}
            onClick={handleShowAddTagToAssetsDialog}
            tone="primary"
            tooltip="Add tag to selected assets"
          />
        )}
        {/* Remove from all */}
        {actions?.includes('removeAll') && (
          <TagButton
            disabled={tag?.updating}
            icon={<ArrowDownIcon />}
            onClick={handleShowRemoveTagFromAssetsDialog}
            tone="critical"
            tooltip="Remove tag from selected assets"
          />
        )}

        {/* Delete icon */}
        {actions?.includes('delete') && (
          <TagButton
            disabled={tag?.updating}
            icon={<TrashIcon />}
            onClick={handleShowTagDeleteDialog}
            tone="critical"
            tooltip="Delete tag"
          />
        )}
      </ButtonContainer>
    </TagContainer>
  )
}

export default Tag
