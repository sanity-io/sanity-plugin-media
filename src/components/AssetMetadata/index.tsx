import {DownloadIcon} from '@sanity/icons'
import {Box, Button, Flex, Stack} from '@sanity/ui'
import {AssetItem, ImageAsset, FileAsset} from '@types'
import format from 'date-fns/format'
import filesize from 'filesize'
import styled from 'styled-components'
import React, {FC, ReactNode} from 'react'

import getAssetResolution from '../../utils/getAssetResolution'
import {isImageAsset} from '../../utils/typeGuards'

type Props = {
  asset: FileAsset | ImageAsset
  item?: AssetItem
}

const StyledBox = styled(Box)`
  font-size: ${props => props.theme.sanity.fonts.text.sizes[1]};
  line-height: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Row = ({label, value}: {label: string; value: ReactNode}) => {
  return (
    <Flex justify="space-between">
      <StyledBox
        style={{
          opacity: 0.8,
          width: '40%'
        }}
      >
        {label}
      </StyledBox>
      <StyledBox
        style={{
          opacity: 0.4,
          textAlign: 'right',
          width: '60%'
        }}
      >
        {value}
      </StyledBox>
    </Flex>
  )
}

const AssetMetadata: FC<Props> = (props: Props) => {
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
        <Stack space={2}>
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
            <Stack space={2}>
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

      {/* Download button */}
      <Box marginTop={5}>
        <Button
          disabled={!item || item?.updating}
          fontSize={1}
          icon={DownloadIcon}
          mode="ghost"
          onClick={handleDownload}
          text="Download"
        />
      </Box>
    </Box>
  )
}

export default AssetMetadata
