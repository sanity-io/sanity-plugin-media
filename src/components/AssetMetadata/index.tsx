import {DownloadIcon} from '@sanity/icons'
import {Box, Button, Flex, Stack, Text} from '@sanity/ui'
import {Asset, AssetItem} from '@types'
import filesize from 'filesize'
import React, {FC} from 'react'

import getAssetResolution from '../../util/getAssetResolution'

type Props = {
  asset: Asset
  item?: AssetItem
}

const AssetMetadata: FC<Props> = (props: Props) => {
  const {asset, item} = props

  // Callbacks
  const handleDownload = () => {
    window.location.href = `${asset.url}?dl=${asset.originalFilename}`
  }

  return (
    <Box marginTop={3}>
      <Stack space={3}>
        {/* Size */}
        <Flex justify="space-between">
          <Text size={1}>Size</Text>
          <Text muted size={1}>
            {filesize(asset?.size, {base: 10, round: 0})}
          </Text>
        </Flex>
        {/* MIME type */}
        <Flex justify="space-between">
          <Text size={1}>MIME type</Text>
          <Text muted size={1}>
            {asset?.mimeType}
          </Text>
        </Flex>
        {/* Extension */}
        <Flex justify="space-between">
          <Text size={1}>Extension</Text>
          <Text muted size={1}>
            {(asset?.extension).toUpperCase()}
          </Text>
        </Flex>
        {/* Dimensions */}
        <Flex justify="space-between">
          <Text size={1}>Dimensions</Text>
          <Text muted size={1}>
            {getAssetResolution(asset)}
          </Text>
        </Flex>
        {/* Download button */}
        <Box marginTop={2}>
          <Button
            disabled={!item || item?.updating}
            fontSize={1}
            icon={DownloadIcon}
            mode="ghost"
            onClick={handleDownload}
            text="Download"
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default AssetMetadata
