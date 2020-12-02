import {Item} from '@types'
import formatRelative from 'date-fns/formatRelative'
import filesize from 'filesize'
import React, {CSSProperties, MouseEvent, memo} from 'react'
import {IoIosAlert} from 'react-icons/io'
import {useDispatch} from 'react-redux'

import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import {assetsPick} from '../../modules/assets'
import {dialogShowConflicts, dialogShowRefs} from '../../modules/dialog'
import Image from '../../styled/Image'
import Box from '../../styled/Box'
import Flex from '../../styled/Flex'
import Button from '../Button/Button'
import ResponsiveBox from '../ResponsiveBox/ResponsiveBox'
import Spinner from '../Spinner/Spinner'
import useTypedSelector from '../../hooks/useTypedSelector'
import imageDprUrl from '../../util/imageDprUrl'
import Checkbox from '../Checkbox/Checkbox'

type Props = {
  item: Item
  selected: boolean
  shiftPressed: boolean
  style?: CSSProperties
}

const TableItem = (props: Props) => {
  const {
    item,
    selected,
    // shiftPressed,
    style
  } = props

  // Redux
  const dispatch = useDispatch()
  const currentDocument = useTypedSelector(state => state.document)

  const asset = item?.asset
  const dimensions = item?.asset?.metadata?.dimensions
  const errorCode = item?.errorCode
  const isOpaque = item?.asset?.metadata?.isOpaque
  const picked = item?.picked
  const updating = item?.updating

  const {onSelect} = useAssetSourceActions()

  // Short circuit if no asset is available
  if (!asset) {
    return null
  }

  // Callbacks
  const handlePickToggle = (e: MouseEvent) => {
    e.stopPropagation()
    dispatch(assetsPick(asset._id, !picked))
  }

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()

    if (currentDocument) {
      if (onSelect) {
        onSelect([
          {
            kind: 'assetDocumentId',
            value: asset._id
          }
        ])
      }
    } else {
      dispatch(dialogShowRefs(asset))
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
      bg={selected ? 'overlayTableRow' : 'none'}
      cursor="pointer"
      display="grid"
      fontSize={1}
      gridColumnGap={2}
      gridTemplateColumns={['tableSmall', 'tableLarge']}
      gridTemplateRows={['auto', '1fr']}
      height={['tableRowHeight.0', 'tableRowHeight.1']}
      onClick={handleClick}
      px={2}
      py={[2, 0]}
      style={style}
      textColor="lightGray"
      transition="background 250ms"
      userSelect="none"
      whiteSpace="nowrap"
    >
      {/* Picked checkbox */}
      <Flex
        alignItems="center"
        gridColumn={[1, 1]}
        gridRowStart={['1', 'auto']}
        gridRowEnd={['span 5', 'auto']}
        height="100%"
        justifyContent="center"
        position="relative"
      >
        <Checkbox checked={picked} height="100%" onClick={handlePickToggle} position="relative" />
      </Flex>

      {/* Preview image + spinner */}
      <Box gridColumn={[2, 2]} gridRowStart={['1', 'auto']} gridRowEnd={['span 5', 'auto']}>
        <ResponsiveBox aspectRatio={4 / 3}>
          <Image
            draggable={false}
            opacity={imageOpacity}
            showCheckerboard={!isOpaque}
            src={imageUrl}
          />

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
        gridColumn={[3, 3]}
        gridRow={[1, 'auto']}
        opacity={cellOpacity}
        overflow="hidden"
        textOverflow="ellipsis"
      >
        <strong>{asset.originalFilename}</strong>
      </Box>

      {/* Dimensions */}
      <Box gridColumn={[3, 4]} gridRow={[2, 'auto']} opacity={cellOpacity}>
        {dimensions.width || '??'} x {dimensions.height || '??'}
      </Box>

      {/* File extension */}
      <Box gridColumn={[3, 5]} gridRow={[3, 'auto']} opacity={cellOpacity}>
        {asset.extension.toUpperCase()}
      </Box>

      {/* Size */}
      <Box gridColumn={[3, 6]} gridRow={[4, 'auto']} opacity={cellOpacity}>
        {filesize(asset.size, {round: 0})}
      </Box>

      {/* Last updated */}
      <Box gridColumn={[3, 7]} gridRow={[5, 'auto']} opacity={cellOpacity}>
        {formatRelative(new Date(asset._updatedAt), new Date())}
      </Box>

      {/* Error */}
      <Box gridColumn={[4, 8]} gridRowStart="1" gridRowEnd={['span 5', 'auto']} mx="auto">
        {errorCode && (
          <Button icon={IoIosAlert({size: 20})} onClick={handleDialogConflicts} variant="danger" />
        )}
      </Box>
    </Box>
  )
}

export default memo(TableItem)
