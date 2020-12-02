import {Asset, Item} from '@types'
import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {areEqual, FixedSizeList, ListOnItemsRenderedProps} from 'react-window'

import TableItem from '../Item/Table'
import useKeyPress from '../../hooks/useKeyPress'
import Box from '../../styled/Box'
import useThemeBreakpointValue from '../../hooks/useThemeBreakpointValue'

type Props = {
  height: number
  itemCount: number
  items: Item[]
  onItemsRendered: (props: ListOnItemsRenderedProps) => any
  selectedAssets?: Asset[]
  width: number
}

type VirtualRowProps = {
  data: Record<string, any>
  index: number
  style: CSSProperties
}

const innerElementType = (props: {children: ReactNode; style: CSSProperties}) => {
  const {children, style} = props
  return (
    <>
      <Box
        alignItems="center"
        bg="darkestGray"
        display={['none', 'grid']}
        gridColumnGap={2}
        gridTemplateColumns="tableLarge"
        height="tableHeaderHeight"
        letterSpacing="0.025em"
        position="sticky"
        px={[0, 2]}
        textColor="lighterGray"
        textTransform="uppercase"
        top={0}
        width="100%"
        zIndex="header"
      >
        <Box textAlign="left"></Box>
        <Box textAlign="left">Original filename</Box>
        <Box textAlign="left">Dimensions</Box>
        <Box textAlign="left">Type</Box>
        <Box textAlign="left">Size</Box>
        <Box textAlign="left">Last updated</Box>
        <Box textAlign="left"></Box>
      </Box>
      <Box position="absolute" top={[0, 'tableHeaderHeight']} width="100%">
        <div style={style}>{children}</div>
      </Box>
    </>
  )
}

const VirtualRow = memo(({data, index, style}: VirtualRowProps) => {
  if (!data) {
    return null
  }
  const {items, selectedIds, shiftPressed} = data
  const item = items[index]
  const assetId = item?.asset?._id

  // Add padding to virtual rows
  const rowStyle = {
    ...style,
    top: Number(style.top) + 2,
    height: Number(style.height) - 2
  }

  return (
    <TableItem
      item={item}
      selected={selectedIds.includes(assetId)}
      shiftPressed={shiftPressed}
      style={rowStyle}
    />
  )
}, areEqual)

const TableView = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, itemCount, onItemsRendered, selectedAssets, width} = props

  const shiftPressed = useKeyPress('Shift')

  const tableRowHeight = useThemeBreakpointValue('tableRowHeight')

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  return (
    <Box height={height} width={width}>
      <FixedSizeList
        className="custom-scrollbar"
        height={height}
        innerElementType={innerElementType}
        itemData={{
          items,
          selectedIds,
          shiftPressed
        }}
        itemCount={itemCount}
        itemSize={parseInt(tableRowHeight)}
        onItemsRendered={onItemsRendered}
        ref={ref}
        style={{
          overflowX: 'hidden'
        }}
        width={width}
      >
        {VirtualRow}
      </FixedSizeList>
    </Box>
  )
})

export default TableView
