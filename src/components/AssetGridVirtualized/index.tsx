import {CardAssetData, CardUploadData} from '@types'
import React, {memo} from 'react'
import {VirtuosoGrid} from 'react-virtuoso'
import styled from 'styled-components'
import useTypedSelector from '../../hooks/useTypedSelector'
import CardAsset from '../CardAsset'
import CardUpload from '../CardUpload'

type Props = {
  items: (CardAssetData | CardUploadData)[]
  onLoadMore?: () => void
}

const CARD_HEIGHT = 220
const CARD_WIDTH = 240

const VirtualCell = memo(
  ({item, selected}: {item: CardAssetData | CardUploadData; selected: boolean}) => {
    if (item?.type === 'asset') {
      return <CardAsset id={item.id} selected={selected} />
    }

    if (item?.type === 'upload') {
      return <CardUpload id={item.id} />
    }

    return null
  }
)

const ItemContainer = styled.div`
  height: ${CARD_HEIGHT}px;
  width: ${CARD_WIDTH}px;
`

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, ${CARD_WIDTH}px);
  justify-content: center;
  margin: 0 auto;
`

const AssetGridVirtualized = (props: Props) => {
  const {items, onLoadMore} = props

  // Redux
  const selectedAssets = useTypedSelector(state => state.selected.assets)

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []
  const totalCount = items?.length

  if (totalCount === 0) {
    return null
  }

  return (
    <VirtuosoGrid
      className="media__custom-scrollbar"
      computeItemKey={index => {
        const item = items[index]
        return item?.id
      }}
      components={{
        Item: ItemContainer,
        List: ListContainer
      }}
      endReached={onLoadMore}
      itemContent={index => {
        const item = items[index]
        const selected = selectedIds.includes(item?.id)
        return <VirtualCell item={item} selected={selected} />
      }}
      overscan={48}
      style={{overflowX: 'hidden'}}
      totalCount={totalCount}
    />
  )
}

export default AssetGridVirtualized
