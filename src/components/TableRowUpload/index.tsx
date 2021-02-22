import {hues} from '@sanity/color'
import {Box, Text} from '@sanity/ui'
import filesize from 'filesize'
import {motion} from 'framer-motion'
import React, {CSSProperties, FC} from 'react'
import {Box as LegacyBox, Grid as LegacyGrid} from 'theme-ui'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectUploadById} from '../../modules/uploads'
import FileIcon from '../FileIcon'
import Image from '../Image'

type Props = {
  id: string
  style?: CSSProperties
}

const TableRowUpload: FC<Props> = (props: Props) => {
  const {id, style} = props

  // Redux
  const item = useTypedSelector(state => selectUploadById(state, id))

  const fileSize = filesize(item.size, {base: 10, round: 0})
  const percentLoaded = Math.round(item?.percent || 0) // (0 - 100)

  const isUploadingOrComplete = ['complete', 'uploading'].includes(item.status)
  const isQueued = item.status === 'queued'

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
      {/* Progress bar */}
      <motion.div
        animate={{
          scaleX: percentLoaded * 0.01
        }}
        initial={{
          scaleX: 0
        }}
        style={{
          background: hues.gray[800].hex,
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

      {/* Percentage */}
      <LegacyBox
        sx={{
          gridColumn: 1,
          gridRowStart: ['1', null, null, 'auto'],
          gridRowEnd: ['span 5', null, null, 'auto'],
          textAlign: 'center'
        }}
      >
        <Text size={1} weight="semibold">
          {isUploadingOrComplete && `${percentLoaded}%`}
        </Text>
      </LegacyBox>

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
        <Text muted={isQueued} size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          Uploading {item.name} {isQueued && ' (Queued)'}
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
