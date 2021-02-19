import {hues} from '@sanity/color'
import {Box, Flex, Text} from '@sanity/ui'
import filesize from 'filesize'
import React, {CSSProperties, FC} from 'react'
import {Box as LegacyBox, Flex as LegacyFlex, Grid as LegacyGrid} from 'theme-ui'

import {UploadItem} from '../../types'
import FileIcon from '../FileIcon'
import Image from '../Image'

type Props = {
  item: UploadItem
  style?: CSSProperties
}

const TableRowUpload: FC<Props> = (props: Props) => {
  const {item, style} = props

  const fileSize = filesize(item.size, {base: 10, round: 0})

  let status
  /*
  if (item.status === 'complete') {
    status = 'Complete'
  }
  */
  if (['complete', 'uploading'].includes(item.status)) {
    status = `${Math.round(item?.percent || 0)}%`
  }
  if (item.status === 'queued') {
    status = 'Queued'
  }

  return (
    <LegacyGrid
      sx={{
        alignItems: 'center',
        bg: hues.gray[950].hex,
        gridColumnGap: [0, null, null, 3],
        gridRowGap: [0],
        gridTemplateColumns: ['tableSmall', null, null, 'tableLarge'],
        gridTemplateRows: ['auto', null, null, '1fr']
      }}
      style={style}
    >
      <LegacyFlex
        sx={{
          gridColumn: 1,
          gridRowStart: ['1', null, null, 'auto'],
          gridRowEnd: ['span 5', null, null, 'auto'],
          height: '100%'
        }}
      />

      {/* Image */}
      <LegacyBox
        sx={{
          gridColumn: [2],
          gridRowStart: ['1', null, null, 'auto'],
          gridRowEnd: ['span 5', null, null, 'auto'],
          height: '90px',
          width: '100px'
        }}
      >
        <Box style={{height: '100%', position: 'relative'}}>
          {item.assetType === 'image' && item?.objectUrl && (
            <Image draggable={false} src={item.objectUrl} style={{opacity: 0.25}} />
          )}

          {item.assetType === 'file' && (
            <div style={{height: '100%', opacity: 0.1}}>
              <FileIcon width="40px" />
            </div>
          )}

          <Flex
            align="center"
            justify="center"
            style={{
              height: '100%',
              left: 0,
              position: 'absolute',
              top: 0,
              width: '100%'
            }}
          >
            <Text size={1} style={{opacity: item.status === 'queued' ? 0.4 : 1}} weight="semibold">
              {status}
            </Text>
          </Flex>
        </Box>
      </LegacyBox>

      {/* Filename */}
      <LegacyBox
        sx={{
          gridColumn: [3],
          gridRow: [2, null, null, 'auto'],
          marginLeft: [3, null, null, 0]
        }}
      >
        <Text size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          Uploading {item.name}
        </Text>
      </LegacyBox>

      {/* Size */}
      <LegacyBox
        sx={{
          gridColumn: [3, null, null, 6],
          gridRow: [3, null, null, 'auto'],
          marginLeft: [3, null, null, 0]
        }}
      >
        <Text size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          {fileSize}
        </Text>
      </LegacyBox>
    </LegacyGrid>
  )
}

export default TableRowUpload
