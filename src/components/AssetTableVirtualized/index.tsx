import type {CardAssetData, CardFolderData, CardUploadData} from '../../types'
import {Box} from '@sanity/ui'
import {memo} from 'react'
import {GroupedVirtuoso} from 'react-virtuoso'
import useTypedSelector from '../../hooks/useTypedSelector'
import TableHeader from '../TableHeader'
import TableRowAsset from '../TableRowAsset'
import TableRowFolder from '../TableRowFolder'
import TableRowUpload from '../TableRowUpload'

type Props = {
  items: (CardAssetData | CardFolderData | CardUploadData)[]
  onLoadMore?: () => void
}

const VirtualRow = memo(
  ({
    item,
    selected
  }: {
    item: CardAssetData | CardFolderData | CardUploadData
    selected: boolean
  }) => {
    if (item?.type === 'asset') {
      return (
        <Box style={{height: '100px'}}>
          <TableRowAsset id={item.id} selected={selected} />
        </Box>
      )
    }

    if (item?.type === 'folder') {
      return (
        <Box style={{height: '100px'}}>
          <TableRowFolder name={item.name} path={item.path} totalCount={item.totalCount} />
        </Box>
      )
    }

    if (item?.type === 'upload') {
      return (
        <Box style={{height: '100px'}}>
          <TableRowUpload id={item.id} />
        </Box>
      )
    }

    return null
  }
)

const AssetTableVirtualized = (props: Props) => {
  const {items, onLoadMore} = props

  // Redux
  const selectedAssets = useTypedSelector(state => state.selected.assets)

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []
  const totalCount = items?.length

  if (totalCount === 0) {
    return null
  }

  return (
    <GroupedVirtuoso
      className="media__custom-scrollbar"
      computeItemKey={index => {
        const item = items[index]
        return item?.id || index
      }}
      endReached={onLoadMore}
      groupCounts={Array(1).fill(totalCount)}
      groupContent={() => {
        return <TableHeader />
      }}
      itemContent={index => {
        const item = items[index]
        const selected = selectedIds.includes(item?.id)
        return <VirtualRow item={item} selected={selected} />
      }}
      style={{overflowX: 'hidden'}}
    />
  )
}

export default AssetTableVirtualized
