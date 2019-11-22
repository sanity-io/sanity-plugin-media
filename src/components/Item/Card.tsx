import React from 'react'
import IoIosCheckmarkOutline from 'react-icons/lib/io/ios-checkmark-outline'
import styled from 'styled-components'
import Button from 'part:@sanity/components/buttons/default'
import ErrorIcon from 'part:@sanity/base/error-icon'
import Spinner from 'part:@sanity/components/loading/spinner'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import useKeyPress from '../../hooks/useKeyPress'
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
}

const Container = styled(Box)`
  transition: background 250ms;
`

const CardItem = (props: Props) => {
  const {focused, item, selected} = props

  const asset = item?.asset
  const errorCode = item?.errorCode
  const isOpaque = item?.asset?.metadata?.isOpaque
  const picked = item?.picked
  const updating = item?.updating

  const {onDialogShowConflicts, onPick, onPickClear, onSelect} = useAssetBrowserActions()

  // TODO: check perf implications, causing unnecessary renders?
  const shiftPressed = useKeyPress('Shift')

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

  return (
    <Container
      bg={picked ? 'whiteOverlay' : 'none'}
      borderRadius="4px"
      display="block"
      onClick={handleAssetPick}
      p={2}
      position="relative"
      userSelect="none"
    >
      {/* Image */}
      <ResponsiveBox aspectRatio={4 / 3}>
        <Image
          draggable={false}
          opacity={updating ? 0.15 : selected && !picked ? 0.15 : 1}
          showCheckerboard={!isOpaque}
          src={imageDprUrl(asset, 200)}
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
            <IoIosCheckmarkOutline size={24} />
          </Box>
        )}

        {/* Spinner */}
        {updating && (
          <Box left={0} position="absolute" size="100%" top={0}>
            <Spinner center />
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
    </Container>
  )
}

export default React.memo(CardItem)
