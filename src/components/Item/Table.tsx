import formatRelative from 'date-fns/formatRelative'
import filesize from 'filesize'
import React from 'react'
import IoIosArrowThinRight from 'react-icons/lib/io/ios-arrow-thin-right'
import IoIosCloseEmpty from 'react-icons/lib/io/ios-close-empty'
import IoIosCheckmarkOutline from 'react-icons/lib/io/ios-checkmark-outline'
import MdError from 'react-icons/lib/md/error'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import Button from 'part:@sanity/components/buttons/default'
import Spinner from 'part:@sanity/components/loading/spinner'

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
}

const TableItem = (props: Props) => {
  const {item, selected} = props
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

  const handleDialogConflicts = (e: React.MouseEvent) => {
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

  return (
    <Row
      bg={picked ? 'whiteOverlay' : 'none'}
      color="gray"
      fontSize={1}
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
            opacity={selected || updating ? 0.15 : 1}
            showCheckerboard={!isOpaque}
            src={imageDprUrl(asset, 100)}
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
              <IoIosCheckmarkOutline size={16} />
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
            icon={IoIosArrowThinRight.bind(null, {size: 26})}
            kind="simple"
            onClick={handleSelect}
          />
        )}
        <Button
          disabled={updating}
          icon={MdInsertLink.bind(null, {size: 16})}
          kind="simple"
          onClick={handleShowRefs}
        />
        <Button
          color="danger"
          disabled={updating}
          icon={IoIosCloseEmpty.bind(null, {size: 24})}
          kind="simple"
          onClick={handleDeleteAsset}
        />
      </Box>
    </Row>
  )
}

export default React.memo(TableItem)
