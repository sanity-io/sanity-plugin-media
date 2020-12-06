import {Label} from '@sanity/ui'
import {Asset, Item} from '@types'
import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {
  areEqual,
  FixedSizeList,
  ListChildComponentProps,
  ListOnItemsRenderedProps
} from 'react-window'
import {Box as LegacyBox} from 'theme-ui'

import TableRow from '../TableRow'
import useKeyPress from '../../hooks/useKeyPress'
import useThemeBreakpointValue from '../../hooks/useThemeBreakpointValue'

type Props = {
  height: number
  itemCount: number
  items: Item[]
  onItemsRendered: (props: ListOnItemsRenderedProps) => any
  selectedAssets?: Asset[]
  width: number
}

const innerElementType = (props: {children: ReactNode; style: CSSProperties}) => {
  const {children, style} = props
  return (
    <>
      <LegacyBox
        sx={{
          alignItems: 'center',
          bg: 'white', // TODO: use theme color
          display: ['none', 'grid'],
          gridColumnGap: [2, 3],
          gridTemplateColumns: 'tableLarge',
          height: 'tableHeaderHeight',
          letterSpacing: '0.025em',
          position: 'sticky',
          // px: [0, 2],
          textTransform: 'uppercase',
          top: 0,
          width: '100%',
          zIndex: 1 // TODO: try to avoid manually setting z-indices
        }}
      >
        <Label></Label>
        <Label></Label>
        <Label size={1}>Filename</Label>
        <Label size={1}>Resolution</Label>
        <Label size={1}>Type</Label>
        <Label size={1}>Size</Label>
        <Label size={1}>Last updated</Label>
        <Label></Label>
      </LegacyBox>
      <LegacyBox
        sx={{
          position: 'absolute',
          top: [0, 'tableHeaderHeight'],
          width: '100%'
        }}
      >
        <div style={style}>{children}</div>
      </LegacyBox>
    </>
  )
}

// const VirtualRow = memo(({data, index, style}: VirtualRowProps) => {
const VirtualRow = memo((props: ListChildComponentProps) => {
  const {data, index, style} = props

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
  } as CSSProperties

  return (
    <TableRow
      item={item}
      selected={selectedIds.includes(assetId)}
      shiftPressed={shiftPressed}
      style={rowStyle}
    />
  )
}, areEqual)

const Table = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, itemCount, onItemsRendered, selectedAssets, width} = props

  const shiftPressed = useKeyPress('Shift')

  const tableRowHeight = useThemeBreakpointValue('tableRowHeight')

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  return (
    <LegacyBox
      sx={{
        height,
        width
      }}
    >
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
    </LegacyBox>
  )
})

export default Table
