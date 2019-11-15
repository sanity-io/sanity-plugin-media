import React from 'react'
import styled from 'styled-components'
import {layout} from 'styled-system'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import TableItem from '../Item/Table'
import Box from '../../styled/Box'
import Checkbox from '../../styled/Checkbox'
import Row from '../../styled/Row'
import {Asset, Item} from '../../types'

type Props = {
  items: Item[]
  selectedAssets?: Asset[]
}

const Header = styled(Row)`
  position: sticky;
  /* border-bottom: 1px solid; */
  border-spacing: 0;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${layout};
`

const TableView = (props: Props) => {
  const {items, selectedAssets} = props
  const {onPickAll, onPickClear} = useAssetBrowserActions()

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

  return (
    <Box width="100%" {...props}>
      <Header
        bg="darkestGray"
        color="gray"
        display={['none', 'grid']}
        position="sticky"
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

      {items &&
        items.map(item => {
          const assetId = item?.asset?._id
          return (
            <TableItem
              item={item}
              key={`table-${assetId}`}
              selected={selectedIds.includes(assetId)}
            />
          )
        })}
    </Box>
  )
}

export default TableView
