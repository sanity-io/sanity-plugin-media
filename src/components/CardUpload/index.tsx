import {hues} from '@sanity/color'
import {CloseIcon} from '@sanity/icons'
import {Box, Button, Flex, Text, Tooltip} from '@sanity/ui'
import filesize from 'filesize'
import {motion} from 'framer-motion'
import React, {CSSProperties, FC} from 'react'
import {useDispatch} from 'react-redux'

import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectUploadById, uploadsActions} from '../../modules/uploads'
import FileIcon from '../FileIcon'
import Image from '../Image'

type Props = {
  id: string
  style?: CSSProperties
}

const CardUpload: FC<Props> = (props: Props) => {
  const {id, style} = props

  // Redux
  const dispatch = useDispatch()
  const item = useTypedSelector(state => selectUploadById(state, id))

  const fileSize = filesize(item.size, {base: 10, round: 0})
  const percentLoaded = Math.round(item?.percent || 0) // (0 - 100)

  const isComplete = item.status === 'complete'
  const isUploading = item.status === 'uploading'
  const isQueued = item.status === 'queued'

  let status
  if (isComplete) {
    status = 'Verifying'
  }
  if (isUploading) {
    status = `${percentLoaded}%`
  }
  if (isQueued) {
    status = 'Queued'
  }

  // Callbacks
  const handleCancelUpload = () => {
    dispatch(uploadsActions.uploadCancel({hash: item.hash}))
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

        {/* Cancel upload button */}
        {!isComplete && (
          <Flex
            align="center"
            direction="column"
            justify="center"
            style={{
              height: '100%',
              left: 0,
              position: 'absolute',
              top: 0,
              width: '100%'
            }}
          >
            <Tooltip
              content={
                <Box padding={2}>
                  <Text muted size={1}>
                    Cancel
                  </Text>
                </Box>
              }
              disabled={'ontouchstart' in window}
              placement="top"
            >
              <Button
                fontSize={4}
                icon={CloseIcon}
                mode="bleed"
                onClick={handleCancelUpload}
                padding={2}
                style={{background: 'none', boxShadow: 'none'}}
                tone="critical"
              />
            </Tooltip>
          </Flex>
        )}
      </Box>

      {/* Footer */}
      <Flex
        align="center"
        justify="space-between"
        paddingX={2}
        style={{height: `${PANEL_HEIGHT}px`}}
      >
        <Box flex={1} marginRight={1}>
          <Text size={0} textOverflow="ellipsis">
            {item.name} ({fileSize})
          </Text>
        </Box>
        <Text size={0} style={{flexShrink: 0}} weight="semibold">
          {status}
        </Text>
      </Flex>
    </Flex>
  )
}

export default CardUpload
