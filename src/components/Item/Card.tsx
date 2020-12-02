import React, {CSSProperties, MouseEvent, memo} from 'react'
import {IoIosAlert, IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline} from 'react-icons/io'
import {useDispatch} from 'react-redux'

import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import {assetsPick, assetsPickClear} from '../../modules/assets'
import {dialogShowConflicts} from '../../modules/dialog'
import Box from '../../styled/Box'
import Flex from '../../styled/Flex'
import Image from '../../styled/Image'
import {Item} from '../../types'
import imageDprUrl from '../../util/imageDprUrl'
import Button from '../Button/Button'
import ResponsiveBox from '../ResponsiveBox/ResponsiveBox'
import Spinner from '../Spinner/Spinner'

type Props = {
  focused: boolean
  item: Item
  selected: boolean
  shiftPressed: boolean
  style?: CSSProperties
}

const CardItem = (props: Props) => {
  const {focused, item, selected, shiftPressed, style} = props

  // Redux
  const dispatch = useDispatch()

  const asset = item?.asset
  const errorCode = item?.errorCode
  const isOpaque = item?.asset?.metadata?.isOpaque
  const picked = item?.picked
  const updating = item?.updating

  const {onSelect} = useAssetSourceActions()

  // Short circuit if no asset is available
  if (!asset) {
    return null
  }

  // Unpick all and pick current on click. If the shift key is held, toggle picked state only.
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
    <Flex
      alignItems="center"
      bg={picked ? 'overlayCard' : 'none'}
      borderRadius="4px"
      justifyContent="center"
      onClick={handleAssetPick}
      onDoubleClick={selected ? undefined : handleSelect}
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
          <Box bottom={0} position="absolute" right={0} textColor="white">
            <Button icon={IoIosCheckmarkCircle({size: 20})} pointerEvents="none" />
          </Box>
        )}

        {/* Spinner */}
        {updating && (
          <Flex
            alignItems="center"
            fontSize={3}
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

        {/* Select button */}
        {focused && onSelect && !selected && (
          <Box
            bottom={0}
            onClick={handleDialogConflicts}
            position="absolute"
            right={0}
            textColor="white"
          >
            <Button icon={IoIosCheckmarkCircleOutline({size: 20})} onClick={handleSelect} />
          </Box>
        )}

        {/* Error button */}
        {errorCode && (
          <Box bottom={0} color="white" position="absolute" right={0} top={0}>
            <Button
              icon={IoIosAlert({size: 20})}
              onClick={handleDialogConflicts}
              variant="danger"
            />
          </Box>
        )}
      </ResponsiveBox>
    </Flex>
  )
}

export default memo(CardItem)
