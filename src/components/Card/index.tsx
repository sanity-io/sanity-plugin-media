import {CheckmarkCircleIcon, EditIcon, WarningOutlineIcon} from '@sanity/icons'
import {Box, Checkbox, Flex, Spinner, Text, Tooltip} from '@sanity/ui'
import {AssetItem} from '@types'
import React, {CSSProperties, MouseEvent, RefObject, memo} from 'react'
import {useDispatch} from 'react-redux'
import styled, {css} from 'styled-components'

import FileIcon from '../../components/FileIcon'
import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import useKeyPress from '../../hooks/useKeyPress'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsPick, assetsPickRange} from '../../modules/assets'
import {dialogShowDetails} from '../../modules/dialog'
import imageDprUrl from '../../utils/imageDprUrl'
import {isFileAsset, isImageAsset} from '../../utils/typeGuards'
import Image from '../Image'

type Props = {
  item: AssetItem
  selected: boolean
  style?: CSSProperties
}

const Container = styled(Flex)<{picked?: boolean; updating?: boolean}>`
  background: #222; // TODO: use theme colors
  border: 1px solid transparent;
  border-radius: 3px;
  overflow: hidden;
  pointer-events: ${props => (props.updating ? 'none' : 'auto')};
  position: relative;
  transition: all 300ms;
  user-select: none;

  border: ${props =>
    props.picked
      ? `1px solid ${props.theme.sanity.color.spot.orange} !important`
      : '1px solid inherit'};

  ${props =>
    !props.updating &&
    css`
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          border: 1px solid ${props => props.theme.sanity.color.spot.gray};
        }
      }
    `}
`

const ContextActionContainer = styled(Box)`
  cursor: ${props => (props.selected ? 'default' : 'pointer')};
  transition: all 300ms;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #1a1a1a; // TODO: use theme colors
    }
  }
`

const StyledWarningOutlineIcon = styled(WarningOutlineIcon)(({theme}) => {
  return {
    color: theme.sanity.color.spot.red
  }
})

const Card = (props: Props) => {
  const {item, selected, style} = props

  // Refs
  const shiftPressed: RefObject<boolean> = useKeyPress('shift')

  // Redux
  const dispatch = useDispatch()
  const lastPicked = useTypedSelector(state => state.assets.lastPicked)

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
  const handleAssetClick = (e: MouseEvent) => {
    e.stopPropagation()

    if (onSelect) {
      onSelect([
        {
          kind: 'assetDocumentId',
          value: asset._id
        }
      ])
    } else {
      if (shiftPressed.current) {
        if (picked) {
          dispatch(assetsPick(asset._id, !picked))
        } else {
          dispatch(assetsPickRange(lastPicked || asset._id, asset._id))
        }
      } else {
        dispatch(dialogShowDetails(asset._id))
      }
    }
  }

  const handleContextActionClick = (e: MouseEvent) => {
    e.stopPropagation()

    if (onSelect) {
      dispatch(dialogShowDetails(asset._id))
    } else {
      if (shiftPressed.current && !picked) {
        dispatch(assetsPickRange(lastPicked || asset._id, asset._id))
      } else {
        dispatch(assetsPick(asset._id, !picked))
      }
    }
  }

  const opacityContainer = updating ? 0.5 : 1
  const opacityPreview = selected || updating ? 0.25 : 1

  return (
    <>
      <Container direction="column" picked={picked} style={{...style}} updating={item.updating}>
        {/* Image */}
        <Box
          flex={1}
          style={{
            cursor: selected ? 'default' : 'pointer',
            opacity: opacityContainer,
            position: 'relative'
          }}
        >
          <div
            onClick={handleAssetClick}
            style={{
              height: '100%',
              opacity: opacityPreview
            }}
          >
            {/* File icon */}
            {isFileAsset(asset) && <FileIcon asset={asset} width="80px" />}

            {/* Image */}
            {isImageAsset(asset) && (
              <Image
                showCheckerboard={!isOpaque}
                src={imageDprUrl(asset, {height: 250, width: 250})}
                style={{
                  draggable: false,
                  transition: 'opacity 1000ms'
                }}
              />
            )}
          </div>

          {/* Selected check icon */}
          {selected && !updating && (
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
              <Text size={2}>
                <CheckmarkCircleIcon />
              </Text>
            </Flex>
          )}

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
        </Box>

        {/* Footer */}
        <ContextActionContainer onClick={handleContextActionClick} padding={2}>
          <Flex align="center">
            {onSelect ? (
              <EditIcon
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
              <Text size={0} textOverflow="ellipsis">
                {asset.originalFilename}
              </Text>
            </Box>
          </Flex>
        </ContextActionContainer>

        {/* TODO: DRY */}
        {/* Error button */}
        {errorCode && (
          <Box
            padding={3}
            style={{
              position: 'absolute',
              right: 0,
              top: 0
            }}
          >
            <Tooltip
              content={
                <Box
                  padding={2}
                  style={{
                    minWidth: '110px', // TODO: is this necessary?
                    textAlign: 'center'
                  }}
                >
                  <Text size={1}>has references</Text>
                </Box>
              }
              placement="left"
            >
              <Text size={1}>
                <StyledWarningOutlineIcon color="critical" />
              </Text>
            </Tooltip>
          </Box>
        )}
      </Container>
    </>
  )
}

export default memo(Card)
