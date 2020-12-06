import {Item, Asset} from '@types'
import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {GridOnItemsRenderedProps, GridChildComponentProps, VariableSizeGrid} from 'react-window'
import {Box} from 'theme-ui'

import useKeyPress from '../../hooks/useKeyPress'
import Card from '../Card'

type Props = {
  height: number
  items: Item[]
  itemCount: number
  onItemsRendered: (props: GridOnItemsRenderedProps) => any
  selectedAssets?: Asset[]
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

  const {columnCount, items, selectedIds, shiftPressed} = data
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
      shiftPressed={shiftPressed}
      style={cellStyle}
    />
  )
})

const Cards = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, itemCount, onItemsRendered, selectedAssets, width} = props

  const shiftPressed = useKeyPress('Shift')

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  const cardWidth = 260
  const cardHeight = 220

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

export default Cards
