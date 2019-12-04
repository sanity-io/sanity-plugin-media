import React, {CSSProperties, MouseEvent, memo} from 'react'
import {IoMdCheckmarkCircleOutline} from 'react-icons/io'
import Button from 'part:@sanity/components/buttons/default'
import ErrorIcon from 'part:@sanity/base/error-icon'
import Spinner from 'part:@sanity/components/loading/spinner'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import Box from '../../styled/Box'
import IconButton from '../../styled/IconButton'
import ResponsiveBox from '../ResponsiveBox/ResponsiveBox'
import Image from '../../styled/Image'
import {Item} from '../../types'
import imageDprUrl from '../../util/imageDprUrl'

type Props = {
  focused: boolean
  item: Item
  selected: boolean
  shiftPressed: boolean
  style?: CSSProperties
}

const CardItem = (props: Props) => {
  const {focused, item, selected, shiftPressed, style} = props

  const asset = item?.asset
  const errorCode = item?.errorCode
  const isOpaque = item?.asset?.metadata?.isOpaque
  const picked = item?.picked
  const updating = item?.updating

  const {onDialogShowConflicts, onPick, onPickClear, onSelect} = useAssetBrowserActions()

  // Short circuit if no asset is available
  if (!asset) {
    return null
  }

  // Unpick all and pick current on click. If the shift key is held, toggle picked state only.
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

  const handleSelect = () => {
    if (onSelect) {
      onSelect([
        {
          kind: 'assetDocumentId',
          value: asset._id
        }
      ])
    }
  }

  const imageUrl = imageDprUrl(asset, 250)
  const imageOpacity = updating ? 0.25 : selected && !picked ? 0.25 : 1

  return (
    <Box
      alignItems="center"
      bg={picked ? 'overlayCard' : 'none'}
      borderRadius="4px"
      display="flex"
      justifyContent="center"
      onClick={handleAssetPick}
      p={2}
      position="relative"
      style={style}
      transition="background 250ms"
      userSelect="none"
    >
      {/* Image */}
      <ResponsiveBox aspectRatio={4 / 3}>
        <Image
          draggable={false}
          opacity={imageOpacity}
          showCheckerboard={!isOpaque}
          src={imageUrl}
          transition="opacity 1000ms"
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
            <IoMdCheckmarkCircleOutline size={18} />
          </Box>
        )}

        {/* Spinner */}
        {updating && (
          <Box
            alignItems="center"
            color="white"
            display="flex"
            fontSize={3}
            justifyContent="center"
            left={0}
            position="absolute"
            size="100%"
            top={0}
          >
            <Spinner />
          </Box>
        )}

        {/* Insert image button */}
        {focused && onSelect && (
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
            left={0}
            position="absolute"
            size="100%"
            top={0}
          >
            <Button color="white" onClick={handleSelect}>
              Insert image
            </Button>
          </Box>
        )}

        {/* Error button */}
        {errorCode && (
          <IconButton
            bottom={2}
            color="red"
            fontSize={3}
            onClick={handleDialogConflicts}
            position="absolute"
            right={2}
          >
            <ErrorIcon />
          </IconButton>
        )}
      </ResponsiveBox>
    </Box>
  )
}

export default memo(CardItem)
