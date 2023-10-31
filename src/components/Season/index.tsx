import {ArrowDownIcon, ArrowUpIcon, CloseIcon, EditIcon, SearchIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Container, Flex, Text, Tooltip} from '@sanity/ui'
import {SearchFacetInputSearchableProps} from '@types'
import React, {ReactNode} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {inputs} from '../../config/searchFacets'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'
import {searchActions, selectIsSearchFacetTag} from '../../modules/search'
import {SeasonActions} from '../../types'
import {SeasonItem} from '../../modules/seasons'

type Props = {
  actions?: SeasonActions[]
  season: SeasonItem
}

const SeasonContainer = styled(Flex)`
  height: ${PANEL_HEIGHT}px;
`

const ButtonContainer = styled(Flex)`
  @media (pointer: fine) {
    visibility: hidden;
  }

  @media (hover: hover) and (pointer: fine) {
    ${SeasonContainer}:hover & {
      visibility: visible;
    }
  }
`

type SeasonButtonProps = {
  disabled?: boolean
  icon: ReactNode
  onClick: () => void
  tone?: 'critical' | 'primary'
  tooltip: string
}

const SeasonButton = (props: SeasonButtonProps) => {
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

const Season = (props: Props) => {
  const {actions, season} = props

  // Redux
  const dispatch = useDispatch()
  const assetsPicked = useTypedSelector(selectAssetsPicked)
  const isSearchFacetTag = useTypedSelector(state =>
    selectIsSearchFacetTag(state, season?.season?._id)
  )

  // Callbacks
  const handleSearchFacetTagRemove = () => {
    dispatch(searchActions.facetsRemoveBySeason({seasonId: season.season._id}))
  }

  const handleShowAddSeasonToAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsSeasonAdd({assetsPicked, season: season.season}))
  }

  const handleShowRemoveSeasonFromAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsSeasonRemove({assetsPicked, season: season.season}))
  }

  const handleShowSeasonDeleteDialog = () => {
    dispatch(dialogActions.showConfirmDeleteSeason({season: season.season}))
  }

  const handleShowSeasonEditDialog = () => {
    dispatch(DIALOG_ACTIONS.showSeasonEdit({seasonId: season?.season?._id}))
  }

  const handleSearchFacetTagAddOrUpdate = () => {
    const searchFacet = {
      //@ts-ignore
      ...inputs.season,
      value: {
        label: season?.season?.name?.current,
        value: season?.season?._id
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
    <SeasonContainer align="center" flex={1} justify="space-between" paddingLeft={3}>
      <Box flex={1}>
        <Text
          muted
          size={1}
          style={{
            opacity: season?.updating ? 0.5 : 1.0,
            userSelect: 'none'
          }}
          textOverflow="ellipsis"
        >
          {season?.season?.name?.current}
        </Text>
      </Box>

      <ButtonContainer align="center" style={{flexShrink: 0}}>
        {/* Search facet toggle */}
        {actions?.includes('search') && (
          <SeasonButton
            disabled={season?.updating}
            icon={isSearchFacetTag ? <CloseIcon /> : <SearchIcon />}
            onClick={
              isSearchFacetTag ? handleSearchFacetTagRemove : handleSearchFacetTagAddOrUpdate
            }
            tooltip={isSearchFacetTag ? 'Remove filter' : 'Filter by tag'}
          />
        )}
        {/* Edit icon */}
        {actions?.includes('edit') && (
          <SeasonButton
            disabled={season?.updating}
            icon={<EditIcon />}
            onClick={handleShowSeasonEditDialog}
            tone="primary"
            tooltip="Edit Season"
          />
        )}
        {/* Apply to all */}
        {actions?.includes('applyAll') && (
          <SeasonButton
            disabled={season?.updating}
            icon={<ArrowUpIcon />}
            onClick={handleShowAddSeasonToAssetsDialog}
            tone="primary"
            tooltip="Add Season to selected assets"
          />
        )}
        {/* Remove from all */}
        {actions?.includes('removeAll') && (
          <SeasonButton
            disabled={season?.updating}
            icon={<ArrowDownIcon />}
            onClick={handleShowRemoveSeasonFromAssetsDialog}
            tone="critical"
            tooltip="Remove Season from selected assets"
          />
        )}

        {/* Delete icon */}
        {actions?.includes('delete') && (
          <SeasonButton
            disabled={season?.updating}
            icon={<TrashIcon />}
            onClick={handleShowSeasonDeleteDialog}
            tone="critical"
            tooltip="Delete tag"
          />
        )}
      </ButtonContainer>
    </SeasonContainer>
  )
}

export default Season
