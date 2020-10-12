import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {VariableSizeGrid, GridOnItemsRenderedProps} from 'react-window'

import useKeyPress from '../../hooks/useKeyPress'
import Box from '../../styled/Box'
import {Item, Asset} from '../../types'
import CardItem from '../Item/Card'

type Props = {
  focusedId?: string
  height: number
  items: Item[]
  itemCount: number
  onItemsRendered: (props: GridOnItemsRenderedProps) => any
  selectedAssets?: Asset[]
  width: number
}

type VirtualCellProps = {
  columnIndex: number
  data: Record<string, any>
  rowIndex: number
  style: CSSProperties
}

const innerElementType = (props: {children: ReactNode; style: CSSProperties}) => {
  const {children, style} = props
  return (
    <Box mx="auto" position="relative" width={style.width}>
      <div style={style}>{children}</div>
    </Box>
  )
}

const VirtualCell = memo(({columnIndex, data, rowIndex, style}: VirtualCellProps) => {
  const {columnCount, focusedId, items, selectedIds, shiftPressed} = data
  const index = columnCount * rowIndex + columnIndex
  const item = items[index]
  const assetId = item?.asset?._id

  // Add padding to virtual cells
  const cellStyle = {
    ...style,
    left: Number(style.left) + 3,
    right: Number(style.left) + 3,
    top: Number(style.top) + 3,
    bottom: Number(style.top) + 3,
    width: Number(style.width) - 6,
    height: Number(style.height) - 6
  }

  return (
    <CardItem
      item={item}
      focused={focusedId === assetId}
      key={`grid-${assetId}`}
      selected={selectedIds.includes(assetId)}
      shiftPressed={shiftPressed}
      style={cellStyle}
    />
  )
})

const CardView = forwardRef((props: Props, ref: Ref<any>) => {
  const {focusedId, height, items, itemCount, onItemsRendered, selectedAssets, width} = props

  const shiftPressed = useKeyPress('Shift')

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  const cardWidth = 250
  const cardHeight = 200

  const columnCount = Math.floor(width / cardWidth)
  const rowCount = Math.ceil(itemCount / columnCount)

  return (
    <VariableSizeGrid
      className="custom-scrollbar"
      columnCount={columnCount}
      columnWidth={() => cardWidth}
      height={height}
      innerElementType={innerElementType}
      itemData={{
        columnCount,
        focusedId,
        items,
        selectedIds,
        shiftPressed
      }}
      onItemsRendered={onItemsRendered}
      ref={ref}
      rowCount={rowCount}
      rowHeight={() => cardHeight}
      style={{overflowX: 'hidden'}}
      width={width}
    >
      {VirtualCell}
    </VariableSizeGrid>
  )
})

export default CardView
