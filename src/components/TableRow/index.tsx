import {Icon} from '@sanity/icons'
import {Checkbox, Flex, Spinner} from '@sanity/ui'
import {Item} from '@types'
import formatRelative from 'date-fns/formatRelative'
import filesize from 'filesize'
import React, {CSSProperties, MouseEvent, memo} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {AspectRatio, Box as LegacyBox, Flex as LegacyFlex, Grid as LegacyGrid} from 'theme-ui'

import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import {assetsPick} from '../../modules/assets'
import {dialogShowRefs} from '../../modules/dialog'
import useTypedSelector from '../../hooks/useTypedSelector'
import getAssetResolution from '../../util/getAssetResolution'
import imageDprUrl from '../../util/imageDprUrl'
import Image from '../Image'
import TextEllipsis from '../TextEllipsis'

type Props = {
  item: Item
  selected: boolean
  shiftPressed: boolean
  style?: CSSProperties
}

const ContainerGrid = styled(LegacyGrid)`
  align-items: center;
  cursor: pointer;
  /* transition: background 400ms; */
  user-select: none;
  white-space: nowrap;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(0, 0, 0, 0.25); // TODO: use theme colors
    }
  }
`

const ContextActionContainer = styled(LegacyFlex)`
  /* background: lime; */
  cursor: pointer;
  transition: all 400ms;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #000; // TODO: use theme colors
    }
  }
`

const TableRow = (props: Props) => {
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
  const handleContextActionClick = (e: MouseEvent) => {
    e.stopPropagation()

    if (currentDocument) {
      dispatch(dialogShowRefs(asset))
    } else {
      dispatch(assetsPick(asset._id, !picked))
    }
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

  const cellOpacity = updating ? 0.5 : 1

  const imageUrl = imageDprUrl(asset, 100)
  const imageOpacity = selected || updating ? 0.25 : 1

  return (
    <ContainerGrid
      onClick={handleClick}
      style={style}
      sx={{
        gridColumnGap: [2, null, null, 3],
        gridRowGap: 0,
        gridTemplateColumns: ['tableSmall', null, null, 'tableLarge'],
        gridTemplateRows: ['auto', null, null, '1fr'],
        opacity: cellOpacity
      }}
    >
      {/* Picked checkbox */}
      <ContextActionContainer
        onClick={handleContextActionClick}
        sx={{
          alignItems: 'center',
          gridColumn: [1, null, null, 1],
          gridRowStart: ['1', null, null, 'auto'],
          gridRowEnd: ['span 5', null, null, 'auto'],
          height: '100%',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
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
              pointerEvents: 'none', // TODO: consider alternative for usability
              transform: 'scale(0.8)'
            }}
          />
        )}
      </ContextActionContainer>

      {/* Preview image + spinner */}
      <LegacyBox
        sx={{
          gridColumn: [2, null, null, 2],
          gridRowStart: ['1', null, null, 'auto'],
          gridRowEnd: ['span 5', null, null, 'auto']
        }}
      >
        <AspectRatio ratio={4 / 3}>
          <Image
            draggable={false}
            showCheckerboard={!isOpaque}
            src={imageUrl}
            style={{
              opacity: imageOpacity
            }}
          />

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
        </AspectRatio>
      </LegacyBox>

      {/* Filename */}
      <LegacyBox
        sx={{
          gridColumn: [3, null, null, 3],
          gridRow: [2, null, null, 'auto']
        }}
      >
        <TextEllipsis size={1}>{asset.originalFilename}</TextEllipsis>
      </LegacyBox>

      {/* Resolution */}
      <LegacyBox
        sx={{
          gridColumn: [3, null, null, 4],
          gridRow: [3, null, null, 'auto']
        }}
      >
        <TextEllipsis muted size={1}>
          {getAssetResolution(asset)}
        </TextEllipsis>
      </LegacyBox>

      {/* MIME type */}
      <LegacyBox
        sx={{
          display: ['none', null, null, 'block'],
          gridColumn: 5,
          gridRow: 'auto'
        }}
      >
        <TextEllipsis muted size={1}>
          {asset.mimeType}
        </TextEllipsis>
      </LegacyBox>

      {/* Size */}
      <LegacyBox
        sx={{
          display: ['none', null, null, 'block'],
          gridColumn: 6,
          gridRow: 'auto'
        }}
      >
        <TextEllipsis muted size={1}>
          {filesize(asset.size, {round: 0})}
        </TextEllipsis>
      </LegacyBox>

      {/* Last updated */}
      <LegacyBox
        sx={{
          gridColumn: [3, null, null, 7],
          gridRow: [4, null, null, 'auto']
        }}
      >
        <TextEllipsis muted size={1}>
          {formatRelative(new Date(asset._updatedAt), new Date())}
        </TextEllipsis>
      </LegacyBox>

      {/* Error */}
      <LegacyBox
        sx={{
          gridColumn: [4, null, null, 8],
          gridRowStart: '1',
          gridRowEnd: ['span 5', null, null, 'auto'],
          mx: 'auto'
        }}
      >
        {errorCode && <div>(BUTTON)</div>}
      </LegacyBox>
    </ContainerGrid>
  )
}

export default memo(TableRow)
