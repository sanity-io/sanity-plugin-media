import {AssetItem, UploadItem} from '@types'
import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {
  GridOnItemsRenderedProps,
  GridChildComponentProps,
  FixedSizeGrid,
  areEqual
} from 'react-window'
import {Box} from 'theme-ui'

import useTypedSelector from '../../hooks/useTypedSelector'
import CardAsset from '../CardAsset'
import CardUpload from '../CardUpload'

type Props = {
  height: number
  items: AssetItem[]
  onItemsRendered: (props: GridOnItemsRenderedProps) => any
  uploads: UploadItem[]
  width: number
}

const innerElementType = (props: {children: ReactNode; style: CSSProperties}) => {
  const {children, style} = props
  return (
    <Box
      sx={{
        mx: 'auto',
        position: 'relative',
        width: style.width
      }}
    >
      <div style={style}>{children}</div>
    </Box>
  )
}

const VirtualCell = memo((props: GridChildComponentProps) => {
  const {columnIndex, data, rowIndex, style} = props
  const {columnCount, combinedItems, selectedIds} = data

  const index = columnCount * rowIndex + columnIndex
  const item = combinedItems[index]

  // Add padding to virtual cells
  const MARGIN_X = 3
  const MARGIN_Y = 3

  const cellStyle = {
    ...style,
    left: Number(style.left) + MARGIN_X,
    right: Number(style.left) + MARGIN_X,
    top: Number(style.top) + MARGIN_Y,
    bottom: Number(style.top) + MARGIN_Y,
    width: Number(style.width) - MARGIN_X * 2,
    height: Number(style.height) - MARGIN_Y * 2
  } as CSSProperties

  if (item?._type === 'asset') {
    return (
      <CardAsset item={item} selected={selectedIds.includes(item?.asset?._id)} style={cellStyle} />
    )
  }

  if (item?._type === 'upload') {
    return <CardUpload item={item} style={cellStyle} />
  }

  return null
}, areEqual)

const Cards = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, onItemsRendered, width, uploads} = props

  // Redux
  const selectedAssets = useTypedSelector(state => state.selectedAssets)

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []
  const combinedItems: (AssetItem | UploadItem)[] = [...uploads, ...items]
  const totalCount = combinedItems?.length

  const cardWidth = 240
  const cardHeight = 220

  const columnCount = Math.max(1, Math.floor(width / cardWidth))
  const rowCount = Math.ceil(totalCount / columnCount)

  const itemKey = ({columnIndex, rowIndex}: {columnIndex: number; rowIndex: number}) => {
    const index = columnCount * rowIndex + columnIndex
    const item = combinedItems[index]
    if (item?._type === 'asset') {
      return item.asset._id
    }
    if (item?._type === 'upload') {
      return item.hash
    }
    return index
  }

  return (
    <FixedSizeGrid
      className="media__custom-scrollbar"
      columnCount={columnCount}
      columnWidth={cardWidth}
      height={height}
      innerElementType={innerElementType}
      itemData={{
        combinedItems,
        columnCount,
        selectedIds
      }}
      itemKey={itemKey}
      onItemsRendered={onItemsRendered}
      ref={ref}
      rowCount={rowCount}
      rowHeight={cardHeight}
      style={{
        overflowX: 'hidden',
        overflowY: 'scroll'
      }}
      width={width}
    >
      {VirtualCell}
    </FixedSizeGrid>
  )
})

export default Cards
