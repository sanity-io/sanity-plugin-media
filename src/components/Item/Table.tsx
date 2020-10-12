import formatRelative from 'date-fns/formatRelative'
import filesize from 'filesize'
import React, {CSSProperties, MouseEvent, memo} from 'react'
import {IoMdCheckmarkCircle} from 'react-icons/io'
import ErrorIcon from 'part:@sanity/base/error-icon'
import Spinner from 'part:@sanity/components/loading/spinner'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import Image from '../../styled/Image'
import Box from '../../styled/Box'
import Button from '../Button/Button'
import ResponsiveBox from '../ResponsiveBox/ResponsiveBox'
import {Item} from '../../types'
import imageDprUrl from '../../util/imageDprUrl'

type Props = {
  item: Item
  selected: boolean
  shiftPressed: boolean
  style?: CSSProperties
}

const TableItem = (props: Props) => {
  const {item, selected, shiftPressed, style} = props
  const {onDialogShowConflicts, onPick, onPickClear} = useAssetBrowserActions()

  const asset = item?.asset
  const dimensions = item?.asset?.metadata?.dimensions
  const errorCode = item?.errorCode
  const isOpaque = item?.asset?.metadata?.isOpaque
  const picked = item?.picked
  const updating = item?.updating

  // Short circuit if no asset is available
  if (!asset) {
    return null
  }

  const handleAssetPick = () => {
    if (!shiftPressed) {
      onPickClear()
      onPick(asset._id, true)
    } else {
      onPick(asset._id, !picked)
    }
  }

  const handleDialogConflicts = (e: MouseEvent) => {
    e.stopPropagation()
    onDialogShowConflicts(asset)
  }

  const cellOpacity = updating ? 0.5 : 1

  const imageUrl = imageDprUrl(asset, 100)
  const imageOpacity = selected || updating ? 0.25 : 1

  return (
    <Box
      alignItems="center"
      bg={picked ? 'overlayTableRow' : 'none'}
      display="grid"
      fontSize={1}
      gridColumnGap={[3, 2]}
      gridTemplateColumns={['tableSmall', 'tableLarge']}
      gridTemplateRows={['auto', '1fr']}
      height={['tableRowHeight.0', 'tableRowHeight.1']}
      onClick={handleAssetPick}
      px={[3, 2]}
      py={[2, 0]}
      style={style}
      textColor="lightGray"
      transition="background 250ms"
      userSelect="none"
      whiteSpace="nowrap"
    >
      {/* Preview image + spinner */}
      <Box gridColumn={[1, 1]} gridRowStart={['1', 'auto']} gridRowEnd={['span 5', 'auto']}>
        <ResponsiveBox aspectRatio={4 / 3}>
          <Image
            draggable={false}
            opacity={imageOpacity}
            showCheckerboard={!isOpaque}
            src={imageUrl}
          />

          {/* Selected checkmark */}
          {selected && (
            <Box
              alignItems="center"
              display="flex"
              justifyContent="center"
              left={0}
              position="absolute"
              size="100%"
              textColor="white"
              top={0}
            >
              <IoMdCheckmarkCircle size={16} />
            </Box>
          )}

          {/* Spinner */}
          {updating && (
            <Box
              alignItems="center"
              display="flex"
              fontSize={2}
              justifyContent="center"
              left={0}
              position="absolute"
              size="100%"
              textColor="white"
              top={0}
            >
              <Spinner />
            </Box>
          )}
        </ResponsiveBox>
      </Box>

      {/* Filename */}
      <Box
        gridColumn={[2, 2]}
        gridRow={[1, 'auto']}
        opacity={cellOpacity}
        overflow="hidden"
        textOverflow="ellipsis"
      >
        <strong>{asset.originalFilename}</strong>
      </Box>

      {/* Dimensions */}
      <Box gridColumn={[2, 3]} gridRow={[2, 'auto']} opacity={cellOpacity}>
        {dimensions.width || '??'} x {dimensions.height || '??'}
      </Box>

      {/* File extension */}
      <Box gridColumn={[2, 4]} gridRow={[3, 'auto']} opacity={cellOpacity}>
        {asset.extension.toUpperCase()}
      </Box>

      {/* Size */}
      <Box gridColumn={[2, 5]} gridRow={[4, 'auto']} opacity={cellOpacity}>
        {filesize(asset.size, {round: 0})}
      </Box>

      {/* Last updated */}
      <Box gridColumn={[2, 6]} gridRow={[5, 'auto']} opacity={cellOpacity}>
        {formatRelative(new Date(asset._updatedAt), new Date())}
      </Box>

      {/* Error */}
      <Box gridColumn={[3, 7]} gridRowStart="1" gridRowEnd={['span 5', 'auto']} mx="auto">
        {errorCode && (
          <Button
            // color="danger"
            // icon={ErrorIcon.bind(null, {size: 20})}
            onClick={handleDialogConflicts}
          >
            <ErrorIcon size={20} />
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default memo(TableItem)
