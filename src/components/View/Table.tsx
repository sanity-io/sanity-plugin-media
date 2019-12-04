import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {areEqual, FixedSizeList, ListOnItemsRenderedProps} from 'react-window'

import TableItem from '../Item/Table'
import useKeyPress from '../../hooks/useKeyPress'
import Box from '../../styled/Box'
import {Asset, Item} from '../../types'
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

const VirtualRow = memo(({data, index, style}: VirtualRowProps) => {
  if (!data) {
    return null
  }
  const {items, selectedIds, shiftPressed} = data
  const item = items[index]
  const assetId = item?.asset?._id

  return (
    <TableItem
      item={item}
      selected={selectedIds.includes(assetId)}
      shiftPressed={shiftPressed}
      style={style}
    />
  )
}, areEqual)

const TableView = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, itemCount, onItemsRendered, selectedAssets, width} = props

  const shiftPressed = useKeyPress('Shift')

  const tableRowHeight = useThemeBreakpointValue('tableRowHeight')

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  const innerElementType = ({children, ...rest}: {children: ReactNode}) => {
    return (
      <>
        <Box
          alignItems="center"
          bg="darkestGray"
          color="lightGray"
          display={['none', 'grid']}
          gridColumnGap={2}
          gridTemplateColumns="tableLarge"
          height="tableHeaderHeight"
          letterSpacing="0.025em"
          position="sticky"
          px={[0, 2]}
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
          <div {...rest}>{children}</div>
        </Box>
      </>
    )
  }

  return (
    <Box height={height} width={width}>
      <FixedSizeList
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
        width={width}
      >
        {VirtualRow}
      </FixedSizeList>
    </Box>
  )
})

export default TableView
