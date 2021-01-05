import {Box} from '@sanity/ui'
import {AssetItem} from '@types'
import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {
  areEqual,
  FixedSizeList,
  ListChildComponentProps,
  ListOnItemsRenderedProps
} from 'react-window'

import useTypedSelector from '../../hooks/useTypedSelector'
import TableHeader from '../TableHeader'
import TableRow from '../TableRow'

type Props = {
  height: number
  itemCount: number
  items: AssetItem[]
  onItemsRendered: (props: ListOnItemsRenderedProps) => any
  width: number
}

const innerElementType = (props: {children: ReactNode; style: CSSProperties}) => {
  const {children, style} = props
  return (
    <>
      <TableHeader />

      <Box
        style={{
          position: 'absolute',
          width: '100%'
        }}
      >
        <div style={style}>{children}</div>
      </Box>
    </>
  )
}

// const VirtualRow = memo(({data, index, style}: VirtualRowProps) => {
const VirtualRow = memo((props: ListChildComponentProps) => {
  const {data, index, style} = props

  if (!data) {
    return null
  }
  const {items, selectedIds} = data
  const item = items[index]
  const assetId = item?.asset?._id

  // Add padding to virtual rows
  const rowStyle = {
    ...style,
    top: Number(style.top) + 2,
    height: Number(style.height) - 2
  } as CSSProperties

  return <TableRow item={item} selected={selectedIds.includes(assetId)} style={rowStyle} />
}, areEqual)

const Table = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, itemCount, onItemsRendered, width} = props

  // Redux
  const selectedAssets = useTypedSelector(state => state.selectedAssets)

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  return (
    <FixedSizeList
      // className="custom-scrollbar"
      height={height}
      innerElementType={innerElementType}
      itemData={{
        items,
        selectedIds
      }}
      itemCount={itemCount}
      itemSize={100} // px
      onItemsRendered={onItemsRendered}
      ref={ref}
      style={{
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'scroll'
      }}
      width={width}
    >
      {VirtualRow}
    </FixedSizeList>
  )
})

export default Table
