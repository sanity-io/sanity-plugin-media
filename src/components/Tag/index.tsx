import {ArrowDownIcon, ArrowUpIcon, CloseIcon, EditIcon, SearchIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Container, Flex, Text, Tooltip} from '@sanity/ui'
import {SearchFacetInputSearchableProps, TagActions, TagItem} from '@types'
import {ReactNode} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {inputs} from '../../config/searchFacets'
import {PANEL_HEIGHT, TAG_DOCUMENT_NAME} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'
import {searchActions, selectIsSearchFacetTag} from '../../modules/search'

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
      portal
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
  const isSearchFacetTag = useTypedSelector(state => selectIsSearchFacetTag(state, tag?.tag?._id))
  const panelType = useTypedSelector(state => state.tags.panelType)
  const textType = panelType === TAG_DOCUMENT_NAME ? 'tag' : 'project'

  // Callbacks
  const handleSearchFacetTagRemove = () => {
    dispatch(searchActions.facetsRemoveByTag({tagId: tag.tag._id}))
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
    const inputsTag = panelType === TAG_DOCUMENT_NAME ? inputs.tag : inputs.project

    const searchFacet = {
      ...inputsTag,
      value: {
        label: tag?.tag?.name?.current,
        value: tag?.tag?._id
      }
    } as SearchFacetInputSearchableProps

    if (isSearchFacetTag) {
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
          muted
          size={1}
          style={{
            opacity: tag?.updating ? 0.5 : 1.0,
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
            tooltip={isSearchFacetTag ? 'Remove filter' : `Filter by ${textType}`}
          />
        )}
        {/* Edit icon */}
        {actions?.includes('edit') && (
          <TagButton
            disabled={tag?.updating}
            icon={<EditIcon />}
            onClick={handleShowTagEditDialog}
            tone="primary"
            tooltip={`Edit ${textType}`}
          />
        )}
        {/* Apply to all */}
        {actions?.includes('applyAll') && (
          <TagButton
            disabled={tag?.updating}
            icon={<ArrowUpIcon />}
            onClick={handleShowAddTagToAssetsDialog}
            tone="primary"
            tooltip={`Add ${textType} to selected assets`}
          />
        )}
        {/* Remove from all */}
        {actions?.includes('removeAll') && (
          <TagButton
            disabled={tag?.updating}
            icon={<ArrowDownIcon />}
            onClick={handleShowRemoveTagFromAssetsDialog}
            tone="critical"
            tooltip={`Remove ${textType} from selected assets`}
          />
        )}

        {/* Delete icon */}
        {actions?.includes('delete') && (
          <TagButton
            disabled={tag?.updating}
            icon={<TrashIcon />}
            onClick={handleShowTagDeleteDialog}
            tone="critical"
            tooltip={`Delete ${textType}`}
          />
        )}
      </ButtonContainer>
    </TagContainer>
  )
}

export default Tag
