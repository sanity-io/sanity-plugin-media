import {Icon} from '@sanity/icons'
import {Box, Checkbox, Flex, Spinner, Text, Tooltip} from '@sanity/ui'
import {Item} from '@types'
import React, {CSSProperties, MouseEvent, memo} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsPick} from '../../modules/assets'
import {dialogShowRefs} from '../../modules/dialog'
import imageDprUrl from '../../util/imageDprUrl'
import Image from '../Image'
import TextEllipsis from '../TextEllipsis'

type Props = {
  item: Item
  selected: boolean
  shiftPressed: boolean
  style?: CSSProperties
}

const Container = styled(Flex)`
  background: #222; // TODO: use theme colors
  border: 1px solid transparent;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  transition: all 400ms;
  user-select: none;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border: 1px solid ${props => props.theme.sanity.color.spot.gray};
    }
  }
`

const ContextActionContainer = styled(Box)`
  cursor: pointer;
  transition: all 400ms;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #1a1a1a; // TODO: use theme colors
    }
  }
`

const Card = (props: Props) => {
  const {
    item,
    // selected,
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
  const handlePictureClick = (e: MouseEvent) => {
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

  const handleContextActionClick = (e: MouseEvent) => {
    e.stopPropagation()

    if (currentDocument) {
      dispatch(dialogShowRefs(asset))
    } else {
      dispatch(assetsPick(asset._id, !picked))
    }
  }

  const imageUrl = imageDprUrl(asset, 250)

  return (
    <>
      <Container
        direction="column"
        style={{
          ...style
        }}
      >
        {/* Image */}
        <Box
          flex={1}
          style={{
            cursor: 'pointer'
          }}
        >
          <Image
            onClick={handlePictureClick}
            showCheckerboard={!isOpaque}
            src={imageUrl}
            style={{
              draggable: false,
              opacity: updating ? 0.25 : 1,
              transition: 'opacity 1000ms'
            }}
          />
        </Box>

        {/* Footer */}
        <ContextActionContainer onClick={handleContextActionClick} padding={2}>
          <Flex align="center">
            {currentDocument ? (
              <Icon
                symbol="edit"
                style={{
                  flexShrink: 0,
                  opacity: 0.5
                }}
              />
            ) : (
              <Checkbox
                checked={picked}
                readOnly
                style={{
                  flexShrink: 0,
                  pointerEvents: 'none',
                  transform: 'scale(0.8)'
                }}
              />
            )}

            <Box marginLeft={2}>
              <TextEllipsis size={0}>{asset.originalFilename}</TextEllipsis>
            </Box>

            {/* Error button */}
            {errorCode && (
              <Tooltip
                content={
                  <Box padding={2}>
                    <Text size={1}>has references</Text>
                  </Box>
                }
                placement="top"
              >
                <Text size={1}>
                  <Icon symbol="warning-outline" />
                </Text>
              </Tooltip>
            )}
          </Flex>
        </ContextActionContainer>

        {/* Spinner */}
        {updating && (
          <Flex
            align="center"
            justify="center"
            style={{
              height: '100%',
              left: 0,
              position: 'absolute',
              top: 0,
              width: '100%'
            }}
          >
            <Spinner />
          </Flex>
        )}
      </Container>
    </>
  )
}

export default memo(Card)
