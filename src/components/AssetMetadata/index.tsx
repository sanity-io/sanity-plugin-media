import {DownloadIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Stack, Text} from '@sanity/ui'
import {Asset, AssetItem} from '@types'
import format from 'date-fns/format'
import filesize from 'filesize'
import React, {ReactNode} from 'react'
import getAssetResolution from '../../utils/getAssetResolution'
import {isImageAsset} from '../../utils/typeGuards'
import ButtonAssetCopy from '../ButtonAssetCopy'

type Props = {
  asset: Asset
  item?: AssetItem
}

const Row = ({label, value}: {label: string; value: ReactNode}) => {
  return (
    <Flex justify="space-between">
      <Text
        size={1}
        style={{
          opacity: 0.8,
          width: '40%'
        }}
        textOverflow="ellipsis"
      >
        {label}
      </Text>
      <Text
        size={1}
        style={{
          opacity: 0.4,
          textAlign: 'right',
          width: '60%'
        }}
        textOverflow="ellipsis"
      >
        {value}
      </Text>
    </Flex>
  )
}

const AssetMetadata = (props: Props) => {
  const {asset, item} = props

  const exif = asset?.metadata?.exif

  // Callbacks
  const handleDownload = () => {
    window.location.href = `${asset.url}?dl=${asset.originalFilename}`
  }

  return (
    <Box marginTop={3}>
      {/* Base */}
      <Box>
        <Stack space={3}>
          <Row label="Size" value={filesize(asset?.size, {base: 10, round: 0})} />
          <Row label="MIME type" value={asset?.mimeType} />
          <Row label="Extension" value={(asset?.extension).toUpperCase()} />
          {isImageAsset(asset) && <Row label="Dimensions" value={getAssetResolution(asset)} />}
        </Stack>
      </Box>
      {/* EXIF */}
      {exif && (
        <>
          {/* Divider */}
          <Box
            marginY={4}
            style={{
              background: '#222',
              height: '1px',
              width: '100%'
            }}
          />
          <Box>
            <Stack space={3}>
              {exif.ISO && <Row label="ISO" value={exif.ISO} />}
              {exif.FNumber && <Row label="Aperture" value={`ƒ/${exif.FNumber}`} />}
              {exif.FocalLength && <Row label="Focal length" value={`${exif.FocalLength}mm`} />}
              {exif.ExposureTime && (
                <Row label="Exposure time" value={`1/${1 / exif.ExposureTime}`} />
              )}
              {exif.DateTimeOriginal && (
                <Row label="Original date" value={format(new Date(exif.DateTimeOriginal), 'PPp')} />
              )}
            </Stack>
          </Box>
        </>
      )}

      {/* Asset actions */}
      <Box marginTop={5}>
        <Inline space={2}>
          {/* Download */}
          <Button
            disabled={!item || item?.updating}
            fontSize={1}
            icon={DownloadIcon}
            mode="ghost"
            onClick={handleDownload}
            text="Download"
          />
          {/* Copy to clipboard */}
          <ButtonAssetCopy disabled={!item || item?.updating} url={asset.url} />
        </Inline>
      </Box>
    </Box>
  )
}

export default AssetMetadata
