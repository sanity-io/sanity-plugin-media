import {hues} from '@sanity/color'
import {CloseIcon} from '@sanity/icons'
import {Box, Button, Flex, Grid, Stack, Text, Tooltip, useMediaIndex} from '@sanity/ui'
import filesize from 'filesize'
import React from 'react'
import {useDispatch} from 'react-redux'
import {GRID_TEMPLATE_COLUMNS} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectUploadById, uploadsActions} from '../../modules/uploads'
import FileIcon from '../FileIcon'
import Image from '../Image'

type Props = {
  id: string
}

const TableRowUpload = (props: Props) => {
  const {id} = props

  // Redux
  const dispatch = useDispatch()
  const item = useTypedSelector(state => selectUploadById(state, id))

  const mediaIndex = useMediaIndex()

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
    <Grid
      style={{
        alignItems: 'center',
        background: hues.gray[950].hex,
        gridColumnGap: mediaIndex < 3 ? 0 : '16px',
        gridRowGap: 0,
        gridTemplateColumns:
          mediaIndex < 3 ? GRID_TEMPLATE_COLUMNS.SMALL : GRID_TEMPLATE_COLUMNS.LARGE,
        gridTemplateRows: mediaIndex < 3 ? 'auto' : '1fr',
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

      {/* Image */}
      <Box
        style={{
          gridColumn: 2,
          gridRowStart: mediaIndex < 3 ? 1 : 'auto',
          gridRowEnd: mediaIndex < 3 ? 'span 4' : 'auto',
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

          {/* 
            Cancel upload button.
            Assets will only have a `complete` status _after_ it has been created on your dataset.
            As such, we also hide the cancel button when `percentLoaded === 100`, as cancelling when the asset 
            has been fully uploaded (even with a status of `progress`) won't stop the asset from being created.
          */}
          {!isComplete && percentLoaded !== 100 && (
            <Flex
              align="center"
              justify="center"
              style={{
                position: 'absolute',
                height: '100%',
                left: 0,
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
                  fontSize={3}
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
      </Box>

      {/* Filename */}
      <Box
        style={{
          gridColumn: mediaIndex < 3 ? 3 : '3/8',
          gridRow: mediaIndex < 3 ? '2/4' : 'auto',
          marginLeft: mediaIndex < 3 ? 3 : 0
        }}
      >
        <Stack space={3}>
          <Text muted size={1} textOverflow="ellipsis">
            {item.name} ({fileSize})
          </Text>
          <Text size={1} textOverflow="ellipsis" weight="semibold">
            {status}
          </Text>
        </Stack>
      </Box>
    </Grid>
  )
}

export default TableRowUpload
