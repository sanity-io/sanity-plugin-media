import {Flex, Label} from '@sanity/ui'
import React, {memo, useState} from 'react'
import {Virtuoso} from 'react-virtuoso'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {CollaborationItem, selectCollaborations} from '../../modules/collaborations'
import Collaboration from '../Collaboration'
import {CollaborationActions} from '../../types'

const VirtualRow = memo(
  ({
    isScrolling,
    item
  }: {
    isScrolling?: boolean
    item:
      | string
      | (CollaborationItem & {
          actions: CollaborationActions[]
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
      <Collaboration
        actions={isScrolling ? undefined : item.actions}
        key={item.collaboration?._id}
        collaboration={item}
      />
    )
  }
)

const CollaborationsVirtualized = () => {
  const assetsPicked = useTypedSelector(selectAssetsPicked)
  const collaborations = useTypedSelector(selectCollaborations)

  // State
  const [isScrolling, setIsScrolling] = useState(false)

  // TODO: refactor, there's most certainly a more performant way to do this

  // Filter out all season IDS used (across all) and dedupe
  const pickedSeasonsIds = assetsPicked?.reduce((acc: string[], val) => {
    const assetTagIds =
      val?.asset?.seasons?.map((each: CollaborationItem) => each.collaboration._id) || []
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

  const collaborationsAppliedToAll = collaborations
    .filter(collaboration =>
      seasonIdsSegmented.appliedToAll.includes(collaboration.collaboration._id)
    )
    .map(collaborationItem => ({
      ...collaborationItem,
      actions: ['delete', 'edit'] as CollaborationActions[]
    }))
  const collaborationsAppliedToSome = collaborations
    .filter(collaboration =>
      seasonIdsSegmented.appliedToSome.includes(collaboration.collaboration._id)
    )
    .map(collaborationItem => ({
      ...collaborationItem,
      actions: ['delete', 'edit'] as CollaborationActions[]
    }))
  const collaborationUnused = collaborations
    .filter(collaboration => !pickedSeasonIdsUnique.includes(collaboration.collaboration._id))
    .map(collaborationItem => ({
      ...collaborationItem,
      actions: ['delete', 'edit'] as CollaborationActions[]
    }))

  let items: (
    | string
    | (CollaborationItem & {
        actions: CollaborationActions[]
      })
  )[] = []
  if (assetsPicked.length === 0) {
    items = collaborations.map(each => ({
      ...each,
      actions: ['delete', 'edit'] as CollaborationActions[]
    }))
  } else {
    if (collaborationsAppliedToAll?.length > 0) {
      items = [
        ...items, //
        assetsPicked.length === 1 ? 'Used' : 'Used by all',
        ...collaborationsAppliedToAll
      ]
    }
    if (collaborationsAppliedToSome?.length > 0) {
      items = [
        ...items, //
        'Used by some',
        ...collaborationsAppliedToSome
      ]
    }
    if (collaborationUnused?.length > 0) {
      items = [
        ...items, //
        'Unused',
        ...collaborationUnused
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
        return item.collaboration._id
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

export default CollaborationsVirtualized
