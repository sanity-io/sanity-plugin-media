import formatRelative from 'date-fns/formatRelative'
import filesize from 'filesize'
import React, {CSSProperties, MouseEvent, memo} from 'react'
import {IoIosClose, IoIosLink, IoIosReturnRight, IoMdCheckmarkCircleOutline} from 'react-icons/io'
import {MdError} from 'react-icons/md'
import Spinner from 'part:@sanity/components/loading/spinner'
import Button from 'part:@sanity/components/buttons/default'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import Checkbox from '../../styled/Checkbox'
import IconButton from '../../styled/IconButton'
import Image from '../../styled/Image'
import Box from '../../styled/Box'
import Row from '../../styled/Row'
import ResponsiveBox from '../ResponsiveBox/ResponsiveBox'
import {Item} from '../../types'
import imageDprUrl from '../../util/imageDprUrl'

type Props = {
  item: Item
  selected: boolean
  style?: CSSProperties
}

const TableItem = (props: Props) => {
  const {item, selected, style} = props
  const {
    onDelete,
    onDialogShowConflicts,
    onDialogShowRefs,
    onPick,
    onSelect
  } = useAssetBrowserActions()

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

  const handleCheckboxChange = () => {
    onPick(asset._id, !picked)
  }

  const handleDeleteAsset = () => {
    onDelete(asset)
  }

  const handleDialogConflicts = (e: MouseEvent) => {
    e.stopPropagation()
    onDialogShowConflicts(asset)
  }

  const handleSelect = () => {
    onSelect([
      {
        kind: 'assetDocumentId',
        value: asset._id
      }
    ])
  }

  const handleShowRefs = () => {
    onDialogShowRefs(asset)
  }

  const cellOpacity = updating ? 0.5 : 1

  const imageUrl = imageDprUrl(asset, 100)
  const imageOpacity = selected || updating ? 0.15 : 1

  return (
    <Row
      bg={picked ? 'whiteOverlay' : 'none'}
      color="gray"
      fontSize={1}
      height={['tableRowHeight.0', 'tableRowHeight.1']}
      style={style}
      userSelect="none"
      whiteSpace="nowrap"
    >
      {/* Checkbox */}
      <Box opacity={cellOpacity}>
        <Checkbox checked={picked} disabled={updating} onChange={handleCheckboxChange} mx="auto" />
      </Box>

      {/* Preview image + spinner */}
      <Box>
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
              color="white"
              display="flex"
              justifyContent="center"
              left={0}
              position="absolute"
              size="100%"
              top={0}
            >
              <IoMdCheckmarkCircleOutline size={16} />
            </Box>
          )}

          {/* Spinner */}
          {updating && (
            <Box
              alignItems="center"
              color="white"
              display="flex"
              fontSize={2}
              justifyContent="center"
              left={0}
              position="absolute"
              size="100%"
              top={0}
            >
              <Spinner />
            </Box>
          )}
        </ResponsiveBox>
      </Box>

      {/* Filename */}
      <Box opacity={cellOpacity}>
        <strong>{asset.originalFilename}</strong>
      </Box>

      {/* Dimensions */}
      <Box opacity={cellOpacity}>
        {dimensions.width || 'unknown'} x {dimensions.height || 'unknown'} px
      </Box>

      {/* File extension */}
      <Box opacity={cellOpacity}>{asset.extension.toUpperCase()}</Box>

      {/* Size */}
      <Box opacity={cellOpacity}>{filesize(asset.size, {round: 0})}</Box>

      {/* Last updated */}
      <Box opacity={cellOpacity}>{formatRelative(new Date(asset._updatedAt), new Date())}</Box>

      {/* Error */}
      <Box>
        {errorCode && (
          <IconButton color="red" fontSize={3} onClick={handleDialogConflicts}>
            <MdError />
          </IconButton>
        )}
      </Box>

      {/* Actions */}
      <Box opacity={cellOpacity} textAlign={['left', 'right']}>
        {onSelect && (
          <Button
            disabled={updating}
            icon={IoIosReturnRight.bind(null, {size: 20})}
            kind="simple"
            onClick={handleSelect}
          />
        )}
        <Button
          disabled={updating}
          icon={IoIosLink.bind(null, {size: 16})}
          kind="simple"
          onClick={handleShowRefs}
        />
        <Button
          color="danger"
          disabled={updating}
          icon={IoIosClose.bind(null, {size: 24})}
          kind="simple"
          onClick={handleDeleteAsset}
        />
      </Box>
    </Row>
  )
}

export default memo(TableItem)
