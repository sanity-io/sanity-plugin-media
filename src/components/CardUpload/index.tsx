import {hues} from '@sanity/color'
import {Box, Flex, Text} from '@sanity/ui'
import filesize from 'filesize'
import {motion} from 'framer-motion'
import React, {CSSProperties, FC} from 'react'

import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectUploadById} from '../../modules/uploads'
import FileIcon from '../FileIcon'
import Image from '../Image'

type Props = {
  id: string
  style?: CSSProperties
}

const CardUpload: FC<Props> = (props: Props) => {
  const {id, style} = props

  // Redux
  const item = useTypedSelector(state => selectUploadById(state, id))

  const fileSize = filesize(item.size, {base: 10, round: 0})
  const percentLoaded = Math.round(item?.percent || 0) // (0 - 100)

  const isUploadingOrComplete = ['complete', 'uploading'].includes(item.status)
  const isQueued = item.status === 'queued'

  let status
  if (isUploadingOrComplete) {
    status = `${percentLoaded}%`
  }
  if (isQueued) {
    status = 'Queued'
  }

  return (
    <Flex
      direction="column"
      style={{...style, background: hues.gray[950].hex, border: '1px solid transparent'}}
    >
      {/* Progress bar */}
      <motion.div
        animate={{scaleX: percentLoaded * 0.01}}
        initial={{
          scaleX: 0
        }}
        style={{
          background: hues.gray[600].hex,
          bottom: 0,
          height: '1px',
          left: 0,
          originX: 0,
          originY: '50%',
          position: 'absolute',
          width: '100%'
        }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 100
        }}
      />

      <Box flex={1} style={{position: 'relative'}}>
        {item.assetType === 'image' && item?.objectUrl && (
          <Image
            draggable={false}
            src={item.objectUrl}
            style={{
              opacity: 0.4
            }}
          />
        )}

        {item.assetType === 'file' && (
          <div style={{height: '100%', opacity: 0.1}}>
            <FileIcon width="80px" />
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
          <Text size={1} style={{opacity: isQueued ? 0.5 : 1}} weight="semibold">
            {status}
          </Text>
        </Flex>
      </Box>

      {/* Footer */}
      <Flex align="center" style={{height: `${PANEL_HEIGHT}px`}}>
        <Box paddingX={2}>
          <Text size={0} textOverflow="ellipsis">
            Uploading {item.name} ({fileSize})
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}

export default CardUpload
