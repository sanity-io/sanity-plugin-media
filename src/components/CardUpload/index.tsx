import {hues} from '@sanity/color'
import {CloseIcon} from '@sanity/icons'
import {Box, Button, Flex, Text, Tooltip} from '@sanity/ui'
import filesize from 'filesize'
import React from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectUploadById, uploadsActions} from '../../modules/uploads'
import FileIcon from '../FileIcon'
import Image from '../Image'

type Props = {
  id: string
}

const CardWrapper = styled(Flex)`
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  padding: 2px;
  position: relative;
  width: 100%;
`

const CardUpload = (props: Props) => {
  const {id} = props

  // Redux
  const dispatch = useDispatch()
  const item = useTypedSelector(state => selectUploadById(state, id))

  if (!item) {
    return null
  }

  const fileSize = filesize(item.size, {base: 10, round: 0})
  const percentLoaded = Math.round(item.percent || 0) // (0 - 100)

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
    <CardWrapper>
      <Flex
        direction="column"
        flex={1}
        style={{
          background: hues.gray[950].hex,
          border: '1px solid transparent',
          height: '100%',
          position: 'relative'
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            background: hues.gray[600].hex,
            bottom: 0,
            height: '1px',
            left: 0,
            position: 'absolute',
            width: '100%',
            transform: `scaleX(${percentLoaded * 0.01})`,
            transformOrigin: 'bottom left',
            transition: 'all 1000ms ease-out'
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

          {/* 
          Cancel upload button.
          Assets will only have a `complete` status _after_ it has been created on your dataset.
          As such, we also hide the cancel button when `percentLoaded === 100`, as cancelling when the asset 
          has been fully uploaded (even with a status of `progress`) won't stop the asset from being created.
        */}
          {!isComplete && percentLoaded !== 100 && (
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
    </CardWrapper>
  )
}

export default CardUpload
