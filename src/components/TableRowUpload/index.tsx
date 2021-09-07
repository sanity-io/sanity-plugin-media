import {hues} from '@sanity/color'
import {CloseIcon} from '@sanity/icons'
import {Box, Button, Flex, Stack, Text, Tooltip} from '@sanity/ui'
import filesize from 'filesize'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import {Box as LegacyBox, Grid as LegacyGrid} from 'theme-ui'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectUploadById, uploadsActions} from '../../modules/uploads'
import FileIcon from '../FileIcon'
import Image from '../Image'

type Props = {
  id: string
}

const TableRowUpload: FC<Props> = (props: Props) => {
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
    <LegacyGrid
      sx={{
        alignItems: 'center',
        bg: hues.gray[950].hex,
        gridColumnGap: [0, null, null, 3],
        gridRowGap: [0],
        gridTemplateColumns: ['tableSmall', null, null, 'tableLarge'],
        gridTemplateRows: ['auto', null, null, '1fr'],
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
      <LegacyBox
        sx={{
          gridColumn: [2],
          gridRowStart: ['1', null, null, 'auto'],
          gridRowEnd: ['span 4', null, null, 'auto'],
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

          {/* Cancel upload button */}
          {!isComplete && (
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
      </LegacyBox>

      {/* Filename */}
      <LegacyBox
        sx={{
          gridColumn: [3, null, null, '3/8'],
          gridRow: ['2/4', null, null, 'auto'],
          marginLeft: [3, null, null, 0]
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
      </LegacyBox>
    </LegacyGrid>
  )
}

export default TableRowUpload
