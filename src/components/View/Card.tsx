import React from 'react'
import Box from '../../styled/Box'
import CardItem from '../Item/Card'
import {Item, Asset} from '../../types'

type Props = {
  focusedId?: string
  items: Item[]
  selectedAssets?: Asset[]
}

const CardView = (props: Props) => {
  const {focusedId, items, selectedAssets} = props

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  return (
    <Box>
      <Box
        display="grid"
        gridGap={2}
        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        justifyContent="center"
      >
        {items &&
          items.map(item => {
            const assetId = item?.asset?._id

            return (
              <CardItem
                item={item}
                focused={focusedId === assetId}
                key={`grid-${assetId}`}
                selected={selectedIds.includes(assetId)}
              />
            )
          })}
      </Box>
    </Box>
  )
}

export default CardView
