import {Flex, Label} from '@sanity/ui'
import React, {memo, useState} from 'react'
import {Virtuoso} from 'react-virtuoso'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {SeasonItem, selectSeasons} from '../../modules/seasons'
import Season from '../Season'
import {SeasonActions} from '../../types'

const VirtualRow = memo(
  ({
    isScrolling,
    item
  }: {
    isScrolling?: boolean
    item:
      | string
      | (SeasonItem & {
          actions: SeasonActions[]
        })
  }) => {
    // Render label
    if (typeof item === 'string') {
      return (
        <Flex
          align="center"
          justify="space-between"
          key={item}
          paddingX={3}
          style={{height: `${PANEL_HEIGHT}px`}}
        >
          <Label size={0}>{item}</Label>
        </Flex>
      )
    }

    // Render tag - only display actions if we're not in the process of scrolling
    return (
      <Season
        actions={isScrolling ? undefined : item.actions}
        key={item.season?._id}
        season={item}
      />
    )
  }
)

const SeasonsVirtualized = () => {
  const assetsPicked = useTypedSelector(selectAssetsPicked)
  const seasons = useTypedSelector(selectSeasons)

  // State
  const [isScrolling, setIsScrolling] = useState(false)

  // TODO: refactor, there's most certainly a more performant way to do this

  // Filter out all season IDS used (across all) and dedupe
  const pickedSeasonsIds = assetsPicked?.reduce((acc: string[], val) => {
    const assetTagIds = val?.asset?.seasons?.map((each: SeasonItem) => each.season._id) || []
    acc = acc.concat(assetTagIds)
    return acc
  }, [])
  const pickedSeasonIdsUnique = [...new Set(pickedSeasonsIds)]

  // Segment tags into two buckets:
  // 1. those which exist in all picked assets ('applied to all')
  // 2. those which exist in some picked assets ('applied to some')
  const seasonIdsSegmented = pickedSeasonIdsUnique.reduce(
    (acc: {appliedToAll: string[]; appliedToSome: string[]}, seasonId) => {
      const seasonIsInEveryAsset = assetsPicked.every(assetItem => {
        return assetItem.asset.season === seasonId
      })

      if (seasonIsInEveryAsset) {
        acc.appliedToAll.push(seasonId)
      } else {
        acc.appliedToSome.push(seasonId)
      }
      return acc
    },
    {
      appliedToAll: [],
      appliedToSome: []
    }
  )

  const seasonsAppliedToAll = seasons
    .filter(season => seasonIdsSegmented.appliedToAll.includes(season.season._id))
    .map(seasonItem => ({
      ...seasonItem,
      actions: ['delete', 'edit'] as SeasonActions[]
    }))
  const seasonsAppliedToSome = seasons
    .filter(season => seasonIdsSegmented.appliedToSome.includes(season.season._id))
    .map(seasonItem => ({
      ...seasonItem,
      actions: ['delete', 'edit'] as SeasonActions[]
    }))
  const tagsUnused = seasons
    .filter(season => !pickedSeasonIdsUnique.includes(season.season._id))
    .map(seasonItem => ({
      ...seasonItem,
      actions: ['delete', 'edit'] as SeasonActions[]
    }))

  let items: (
    | string
    | (SeasonItem & {
        actions: SeasonActions[]
      })
  )[] = []
  if (assetsPicked.length === 0) {
    items = seasons.map(seasonItem => ({
      ...seasonItem,
      actions: ['delete', 'edit'] as SeasonActions[]
    }))
  } else {
    if (seasonsAppliedToAll?.length > 0) {
      items = [
        ...items, //
        assetsPicked.length === 1 ? 'Used' : 'Used by all',
        ...seasonsAppliedToAll
      ]
    }
    if (seasonsAppliedToSome?.length > 0) {
      items = [
        ...items, //
        'Used by some',
        ...seasonsAppliedToSome
      ]
    }
    if (tagsUnused?.length > 0) {
      items = [
        ...items, //
        'Unused',
        ...tagsUnused
      ]
    }
  }

  return (
    <Virtuoso
      className="media__custom-scrollbar"
      computeItemKey={index => {
        const item = items[index]
        if (typeof item === 'string') {
          return item
        }
        return item.season._id
      }}
      isScrolling={setIsScrolling}
      itemContent={index => {
        return <VirtualRow isScrolling={isScrolling} item={items[index]} />
      }}
      style={{flex: 1, overflowX: 'hidden'}}
      totalCount={items.length}
    />
  )
}

export default SeasonsVirtualized
