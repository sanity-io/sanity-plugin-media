import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {areEqual, FixedSizeList, ListOnItemsRenderedProps} from 'react-window'
import styled from 'styled-components'
import {layout} from 'styled-system'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import TableItem from '../Item/Table'
import Box from '../../styled/Box'
import Checkbox from '../../styled/Checkbox'
import Row from '../../styled/Row'
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
  const {items, selectedIds} = data
  const item = items[index]
  const assetId = item?.asset?._id

  return <TableItem item={item} selected={selectedIds.includes(assetId)} style={style} />
}, areEqual)

const Header = styled(Row)`
  position: sticky;
  border-spacing: 0;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${layout};
`

const TableView = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, itemCount, onItemsRendered, selectedAssets, width} = props
  const {onPickAll, onPickClear} = useAssetBrowserActions()

  const tableRowHeight = useThemeBreakpointValue('tableRowHeight')

  const picked = items && items.filter(item => item.picked)
  const allPicked = picked.length === items.length

  const handleCheckboxChange = () => {
    if (allPicked) {
      onPickClear()
    } else {
      onPickAll()
    }
  }

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  const innerElementType = ({children, ...rest}: {children: ReactNode}) => {
    return (
      <>
        <Header
          bg="darkestGray"
          color="gray"
          display={['none', 'grid']}
          height="tableHeaderHeight"
          position="fixed"
          top={0}
          zIndex="header"
        >
          <Box textAlign="left">
            {items && items.length > 0 && (
              <Checkbox checked={allPicked} onChange={handleCheckboxChange} mx="auto" />
            )}
          </Box>
          <Box textAlign="left"></Box>
          <Box textAlign="left">Filename</Box>
          <Box textAlign="left">Dimensions</Box>
          <Box textAlign="left">Type</Box>
          <Box textAlign="left">Size</Box>
          <Box textAlign="left">Last updated</Box>
          <Box textAlign="left"></Box>
          <Box textAlign="right">Actions</Box>
        </Header>
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
          selectedIds
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
