import {Box} from '@sanity/ui'
import {CardAssetData, CardUploadData} from '@types'
import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {
  areEqual,
  FixedSizeList,
  ListChildComponentProps,
  ListOnItemsRenderedProps
} from 'react-window'

import useTypedSelector from '../../hooks/useTypedSelector'
import TableHeader from '../TableHeader'
import TableRowAsset from '../TableRowAsset'
import TableRowUpload from '../TableRowUpload'

type Props = {
  height: number
  items: (CardAssetData | CardUploadData)[]
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

const VirtualRow = memo((props: ListChildComponentProps) => {
  const {data, index, style} = props
  const {items, selectedIds} = data

  const item = items[index]

  // Add padding to virtual rows
  const rowStyle = {
    ...style,
    top: Number(style.top),
    height: Number(style.height)
  } as CSSProperties

  if (item?.type === 'asset') {
    return <TableRowAsset id={item.id} selected={selectedIds.includes(item?.id)} style={rowStyle} />
  }

  if (item?.type === 'upload') {
    return <TableRowUpload id={item.id} style={rowStyle} />
  }

  return null
}, areEqual)

const Table = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, onItemsRendered, width} = props

  // Redux
  const selectedAssets = useTypedSelector(state => state.selectedAssets)

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []
  const totalCount = items.length

  const itemKey = (index: number) => {
    const item = items[index]
    return item?.id || index
  }

  return (
    <FixedSizeList
      className="media__custom-scrollbar"
      height={height}
      innerElementType={innerElementType}
      itemData={{
        items,
        selectedIds
      }}
      itemCount={totalCount}
      itemKey={itemKey}
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
