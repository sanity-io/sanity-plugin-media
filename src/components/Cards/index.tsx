import {CardAssetData, CardUploadData} from '@types'
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
  items: (CardAssetData | CardUploadData)[]
  onItemsRendered: (props: GridOnItemsRenderedProps) => any
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
  // TODO: type correctly
  const {columnIndex, data, rowIndex, style} = props
  const {columnCount, items, selectedIds} = data

  const index = columnCount * rowIndex + columnIndex
  const item = items[index]

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
    height: Number(style.height) - MARGIN_Y * 2,
    transition: 'none'
  } as CSSProperties

  if (item?.type === 'asset') {
    return <CardAsset id={item.id} selected={selectedIds.includes(item?.id)} style={cellStyle} />
  }

  if (item?.type === 'upload') {
    return <CardUpload id={item.id} style={cellStyle} />
  }

  return null
}, areEqual)

const Cards = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, onItemsRendered, width} = props

  // Redux
  const selectedAssets = useTypedSelector(state => state.selected.assets)

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []
  const totalCount = items?.length

  const cardWidth = 240
  const cardHeight = 220

  const columnCount = Math.max(1, Math.floor(width / cardWidth))
  const rowCount = Math.ceil(totalCount / columnCount)

  const itemKey = ({columnIndex, rowIndex}: {columnIndex: number; rowIndex: number}) => {
    const index = columnCount * rowIndex + columnIndex
    const item = items[index]
    return item?.id || index
  }

  return (
    <FixedSizeGrid
      className="media__custom-scrollbar"
      columnCount={columnCount}
      columnWidth={cardWidth}
      height={height}
      innerElementType={innerElementType}
      itemData={{
        columnCount,
        items,
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
