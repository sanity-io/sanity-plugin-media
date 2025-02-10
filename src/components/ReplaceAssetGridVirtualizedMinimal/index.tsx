import {CardAssetData, CardUploadData} from '@types'
import React, {memo} from 'react'
import {VirtuosoGrid} from 'react-virtuoso'
import styled from 'styled-components'
import CardAssetMinimal from '../CardAssetMinimal'
import useTypedSelector from '../../hooks/useTypedSelector'

type Props = {
  items: (CardAssetData | CardUploadData)[]
  onLoadMore?: () => void
}

const CARD_HEIGHT = 220
const CARD_WIDTH = 240

const VirtualCell = memo(({item}: {item: CardAssetData | CardUploadData}) => {
  if (item?.type === 'asset') {
    return <CardAssetMinimal id={item.id} selected={false} />
  }

  return null
})

const ItemContainer = styled.div`
  height: ${CARD_HEIGHT}px;
  width: ${CARD_WIDTH}px;
`

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, ${CARD_WIDTH}px);
  grid-template-rows: repeat(auto-fill, ${CARD_HEIGHT}px);
  justify-content: center;
  margin: 0 auto;
`

const ReplaceAssetGridVirtualizedMinimal = (props: Props) => {
  const {items, onLoadMore} = props
  const lastPicked = useTypedSelector(state => state.assets.lastPicked)
  const reducedItems = items.filter(asset => asset.id !== lastPicked)
  // Redux

  const totalCount = reducedItems?.length

  if (totalCount === 0) {
    return null
  }

  return (
    <VirtuosoGrid
      className="media__custom-scrollbar"
      computeItemKey={index => {
        const item = reducedItems[index]
        return item?.id
      }}
      components={{
        Item: ItemContainer,
        List: ListContainer
      }}
      endReached={onLoadMore}
      itemContent={index => {
        const item = reducedItems[index]
        return <VirtualCell item={item} />
      }}
      overscan={48}
      style={{overflowX: 'hidden', overflowY: 'scroll'}}
      totalCount={totalCount}
    />
  )
}

export default ReplaceAssetGridVirtualizedMinimal
