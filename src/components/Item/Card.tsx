import {Item} from '@types'
import React, {CSSProperties, MouseEvent, memo} from 'react'
import {IoIosAlert} from 'react-icons/io'
import {useDispatch} from 'react-redux'

import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsPick} from '../../modules/assets'
import {dialogShowConflicts, dialogShowRefs} from '../../modules/dialog'
import Box from '../../styled/Box'
import Flex from '../../styled/Flex'
import Image from '../../styled/Image'
import imageDprUrl from '../../util/imageDprUrl'
import Button from '../Button/Button'
import Checkbox from '../Checkbox/Checkbox'
import ResponsiveBox from '../ResponsiveBox/ResponsiveBox'
import Spinner from '../Spinner/Spinner'

type Props = {
  item: Item
  selected: boolean
  shiftPressed: boolean
  style?: CSSProperties
}

const CardItem = (props: Props) => {
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
  const handlePickToggle = () => {
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

  const imageUrl = imageDprUrl(asset, 250)

  return (
    <Flex
      alignItems="center"
      bg={selected ? 'overlayCard' : 'none'}
      borderRadius="4px"
      justifyContent="center"
      p={2}
      position="relative"
      style={style}
      transition="background 250ms"
      userSelect="none"
    >
      {/* Image */}
      <ResponsiveBox aspectRatio={4 / 3} cursor="pointer" onClick={handleClick}>
        <Image
          draggable={false}
          opacity={updating ? 0.25 : 1}
          showCheckerboard={!isOpaque}
          src={imageUrl}
          transition="opacity 1000ms"
        />
      </ResponsiveBox>

      {/* Picked checkbox */}
      {!currentDocument && (
        <Checkbox
          checked={picked}
          left={2}
          onClick={handlePickToggle}
          position="absolute"
          top={2}
        />
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

      {/* Error button */}
      {errorCode && (
        <Box bottom={0} color="white" position="absolute" right={0} top={0}>
          <Button icon={IoIosAlert({size: 20})} onClick={handleDialogConflicts} variant="danger" />
        </Box>
      )}
    </Flex>
  )
}

export default memo(CardItem)
