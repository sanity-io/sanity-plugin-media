import {Item} from '@types'
import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {GridOnItemsRenderedProps, GridChildComponentProps, VariableSizeGrid} from 'react-window'
import {Box} from 'theme-ui'

import useTypedSelector from '../../hooks/useTypedSelector'
import Card from '../Card'

type Props = {
  height: number
  items: Item[]
  itemCount: number
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
  const {columnIndex, data, rowIndex, style} = props

  const {columnCount, items, selectedIds} = data
  const index = columnCount * rowIndex + columnIndex
  const item = items[index]
  const assetId = item?.asset?._id

  // Add padding to virtual cells
  const MARGIN_X = 10
  const MARGIN_Y = 10

  const cellStyle = {
    ...style,
    left: Number(style.left) + MARGIN_X,
    right: Number(style.left) + MARGIN_X,
    top: Number(style.top) + MARGIN_Y,
    bottom: Number(style.top) + MARGIN_Y,
    width: Number(style.width) - MARGIN_X * 2,
    height: Number(style.height) - MARGIN_Y * 2
  } as CSSProperties

  return (
    <Card
      item={item}
      key={`grid-${assetId}`}
      selected={selectedIds.includes(assetId)}
      style={cellStyle}
    />
  )
})

const Cards = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, itemCount, onItemsRendered, width} = props

  // Redux
  const selectedAssets = useTypedSelector(state => state.selectedAssets)

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  const cardWidth = 260
  const cardHeight = 220

  const columnCount = Math.floor(width / cardWidth)
  const rowCount = Math.ceil(itemCount / columnCount)

  return (
    <VariableSizeGrid
      // className="custom-scrollbar"
      columnCount={columnCount}
      columnWidth={() => cardWidth}
      height={height}
      innerElementType={innerElementType}
      itemData={{
        columnCount,
        items,
        selectedIds
      }}
      onItemsRendered={onItemsRendered}
      ref={ref}
      rowCount={rowCount}
      rowHeight={() => cardHeight}
      style={{
        overflowX: 'hidden',
        overflowY: 'scroll'
      }}
      width={width}
    >
      {VirtualCell}
    </VariableSizeGrid>
  )
})

export default Cards
