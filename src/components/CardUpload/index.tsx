import {hues} from '@sanity/color'
import {Box, Flex, Text} from '@sanity/ui'
import filesize from 'filesize'
import React, {CSSProperties, FC} from 'react'
import {PANEL_HEIGHT} from '../../constants'

import {UploadItem} from '../../types'
import Image from '../Image'

type Props = {
  item: UploadItem
  style?: CSSProperties
}

const CardUpload: FC<Props> = (props: Props) => {
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
    <Flex
      direction="column"
      style={{...style, background: hues.gray[950].hex, border: '1px solid transparent'}}
    >
      <Box flex={1} style={{position: 'relative'}}>
        {item?.objectUrl && (
          <Image
            draggable={false}
            src={item.objectUrl}
            style={{
              opacity: 0.4
            }}
          />
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
          <Text size={1} style={{opacity: item.status === 'queued' ? 0.5 : 1}}>
            {status}
          </Text>
        </Flex>
      </Box>

      {/* Footer */}
      <Flex align="center" paddingX={2} style={{height: `${PANEL_HEIGHT}px`}}>
        <Text size={0} textOverflow="ellipsis">
          Uploading {item.name} ({fileSize}){' '}
        </Text>
      </Flex>
    </Flex>
  )
}

export default CardUpload
