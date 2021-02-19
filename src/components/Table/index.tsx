import {Box} from '@sanity/ui'
import {AssetItem, UploadItem} from '@types'
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
  items: AssetItem[]
  onItemsRendered: (props: ListOnItemsRenderedProps) => any
  uploads: UploadItem[]
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
  const {combinedItems, selectedIds} = data

  const item = combinedItems[index]

  // Add padding to virtual rows
  const rowStyle = {
    ...style,
    top: Number(style.top),
    height: Number(style.height)
  } as CSSProperties

  if (item?._type === 'asset') {
    return (
      <TableRowAsset
        item={item}
        selected={selectedIds.includes(item?.asset?._id)}
        style={rowStyle}
      />
    )
  }

  if (item?._type === 'upload') {
    return <TableRowUpload item={item} style={rowStyle} />
  }

  return null
}, areEqual)

const Table = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, onItemsRendered, uploads, width} = props

  // Redux
  const selectedAssets = useTypedSelector(state => state.selectedAssets)

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []
  const combinedItems: (AssetItem | UploadItem)[] = [...uploads, ...items]
  const totalCount = items?.length + (uploads?.length || 0)

  const itemKey = (index: number) => {
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
    <FixedSizeList
      className="media__custom-scrollbar"
      height={height}
      innerElementType={innerElementType}
      itemData={{
        combinedItems,
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
