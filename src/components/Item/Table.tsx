import formatRelative from 'date-fns/formatRelative'
import filesize from 'filesize'
import React, {CSSProperties, MouseEvent, memo} from 'react'
import {IoIosAlert, IoMdCheckmarkCircle} from 'react-icons/io'
import {useDispatch} from 'react-redux'

import {assetsPick, assetsPickClear} from '../../modules/assets'
import {dialogShowConflicts} from '../../modules/dialog'
import Image from '../../styled/Image'
import Box from '../../styled/Box'
import Flex from '../../styled/Flex'
import Button from '../Button/Button'
import ResponsiveBox from '../ResponsiveBox/ResponsiveBox'
import Spinner from '../Spinner/Spinner'
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

  // Redux
  const dispatch = useDispatch()

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
      dispatch(assetsPickClear())
      dispatch(assetsPick(asset._id, true))
    } else {
      dispatch(assetsPick(asset._id, !picked))
    }
  }

  const handleDialogConflicts = (e: MouseEvent) => {
    e.stopPropagation()
    dispatch(dialogShowConflicts(asset))
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
            <Flex
              alignItems="center"
              justifyContent="center"
              left={0}
              position="absolute"
              size="100%"
              textColor="white"
              top={0}
            >
              <IoMdCheckmarkCircle size={16} />
            </Flex>
          )}

          {/* Spinner */}
          {updating && (
            <Flex
              alignItems="center"
              fontSize={2}
              justifyContent="center"
              left={0}
              position="absolute"
              size="100%"
              textColor="white"
              top={0}
            >
              <Spinner />
            </Flex>
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
          <Button icon={IoIosAlert({size: 20})} onClick={handleDialogConflicts} variant="danger" />
        )}
      </Box>
    </Box>
  )
}

export default memo(TableItem)
