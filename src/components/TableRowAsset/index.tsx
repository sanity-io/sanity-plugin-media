import {CheckmarkCircleIcon, EditIcon, WarningFilledIcon} from '@sanity/icons'
import {
  Box,
  Checkbox,
  Container,
  Flex,
  Grid,
  Spinner,
  Text,
  type ThemeColorSchemeKey,
  Tooltip,
  useMediaIndex
} from '@sanity/ui'
import formatRelative from 'date-fns/formatRelative'
import filesize from 'filesize'
import {
  memo,
  type MouseEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import {useDispatch} from 'react-redux'
import {WithReferringDocuments, useColorSchemeValue} from 'sanity'
import {styled, css} from 'styled-components'
import {GRID_TEMPLATE_COLUMNS} from '../../constants'
import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import useKeyPress from '../../hooks/useKeyPress'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions, selectAssetById} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import getAssetResolution from '../../utils/getAssetResolution'
import imageDprUrl from '../../utils/imageDprUrl'
import {isFileAsset, isImageAsset} from '../../utils/typeGuards'
import FileIcon from '../FileIcon'
import Image from '../Image'
import {getUniqueDocuments} from '../../utils/getUniqueDocuments'
import {getSchemeColor} from '../../utils/getSchemeColor'

// Duration (ms) to wait before reference counts (and associated listeners) are rendered
const REFERENCE_COUNT_VISIBILITY_DELAY = 750

type Props = {
  id: string
  selected: boolean
}

const ContainerGrid = styled<
  typeof Grid,
  {$selected?: boolean; $scheme: ThemeColorSchemeKey; $updating?: boolean}
>(Grid)(({$scheme, $selected, $updating}) => {
  return css`
    align-items: center;
    cursor: ${$selected ? 'default' : 'pointer'};
    height: 100%;
    pointer-events: ${$updating ? 'none' : 'auto'};
    user-select: none;
    white-space: nowrap;

    ${!$updating &&
    css`
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          background: ${getSchemeColor($scheme, 'bg')};
        }
      }
    `}
  `
})

const ContextActionContainer = styled<typeof Flex, {$scheme: ThemeColorSchemeKey}>(Flex)(
  ({$scheme}) => {
    return css`
      cursor: pointer;
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          background: ${getSchemeColor($scheme, 'bg2')};
        }
      }
    `
  }
)

const StyledWarningIcon = styled(WarningFilledIcon)(({theme}) => {
  return {
    color: theme.sanity.color.spot.red
  }
})

// eslint-disable-next-line complexity
const TableRowAsset = (props: Props) => {
  const {id, selected} = props

  const scheme = useColorSchemeValue()

  const shiftPressed: RefObject<boolean> = useKeyPress('shift')

  const [referenceCountVisible, setReferenceCountVisible] = useState(false)
  const refCountVisibleTimeout = useRef<ReturnType<typeof window.setTimeout>>(null)

  const dispatch = useDispatch()
  const lastPicked = useTypedSelector(state => state.assets.lastPicked)
  const item = useTypedSelector(state => selectAssetById(state, id))

  const mediaIndex = useMediaIndex()

  const asset = item?.asset
  const error = item?.error
  const isOpaque = item?.asset?.metadata?.isOpaque
  const picked = item?.picked
  const updating = item?.updating

  const {onSelect} = useAssetSourceActions()

  const handleContextActionClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (!asset) return
      if (onSelect) {
        dispatch(dialogActions.showAssetEdit({assetId: asset._id}))
      } else if (shiftPressed.current && !picked) {
        dispatch(assetsActions.pickRange({startId: lastPicked || asset._id, endId: asset._id}))
      } else {
        dispatch(assetsActions.pick({assetId: asset._id, picked: !picked}))
      }
    },
    [asset, dispatch, lastPicked, onSelect, picked, shiftPressed]
  )

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (!asset) return
      if (onSelect) {
        onSelect([{kind: 'assetDocumentId', value: asset._id}])
      } else if (shiftPressed.current) {
        if (picked) {
          dispatch(assetsActions.pick({assetId: asset._id, picked: !picked}))
        } else {
          dispatch(assetsActions.pickRange({startId: lastPicked || asset._id, endId: asset._id}))
        }
      } else {
        dispatch(dialogActions.showAssetEdit({assetId: asset._id}))
      }
    },
    [asset, dispatch, lastPicked, onSelect, picked, shiftPressed]
  )

  const opacityCell = updating ? 0.5 : 1
  const opacityPreview = selected || updating ? 0.1 : 1

  // Display reference count after an initial delay to prevent over-eager fetching
  useEffect(() => {
    refCountVisibleTimeout.current = setTimeout(
      () => setReferenceCountVisible(true),
      REFERENCE_COUNT_VISIBILITY_DELAY
    )
    return () => {
      if (refCountVisibleTimeout.current) {
        clearTimeout(refCountVisibleTimeout.current)
      }
    }
  }, [])

  // Short circuit if no asset is available
  if (!asset) {
    return null
  }

  return (
    <ContainerGrid
      onClick={selected ? undefined : handleClick}
      $scheme={scheme}
      $selected={selected}
      style={{
        gridColumnGap: mediaIndex < 3 ? 0 : '16px',
        gridRowGap: 0,
        gridTemplateColumns:
          mediaIndex < 3 ? GRID_TEMPLATE_COLUMNS.SMALL : GRID_TEMPLATE_COLUMNS.LARGE,
        gridTemplateRows: mediaIndex < 3 ? 'auto' : '1fr'
      }}
      $updating={item.updating}
    >
      {/* Picked checkbox */}
      <ContextActionContainer
        onClick={handleContextActionClick}
        $scheme={scheme}
        style={{
          alignItems: 'center',
          gridColumn: 1,
          gridRowStart: 1,
          gridRowEnd: 'span 5',
          height: '100%',
          justifyContent: 'center',
          opacity: opacityCell,
          position: 'relative'
        }}
      >
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
              pointerEvents: 'none', // TODO: consider alternative for usability
              transform: 'scale(0.8)'
            }}
          />
        )}
      </ContextActionContainer>

      {/* Preview image + spinner */}
      <Box
        style={{
          gridColumn: 2,
          gridRowStart: 1,
          gridRowEnd: 'span 5',
          height: '90px',
          width: '100px'
        }}
      >
        <Flex align="center" justify="center" style={{height: '100%', position: 'relative'}}>
          <Box style={{height: '100%', opacity: opacityPreview, position: 'relative'}}>
            {/* File icon */}
            {isFileAsset(asset) && <FileIcon extension={asset.extension} width="40px" />}

            {/* Image */}
            {isImageAsset(asset) && (
              <Image
                draggable={false}
                $scheme={scheme}
                $showCheckerboard={!isOpaque}
                src={imageDprUrl(asset, {height: 100, width: 100})}
              />
            )}
          </Box>

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
        </Flex>
      </Box>

      {/* Filename */}
      <Box
        marginLeft={mediaIndex < 3 ? 3 : 0}
        style={{
          gridColumn: 3,
          gridRow: mediaIndex < 3 ? 2 : 'auto',
          opacity: opacityCell
        }}
      >
        <Text muted size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          {asset.originalFilename}
        </Text>
      </Box>

      {/* Resolution */}
      <Box
        marginLeft={mediaIndex < 3 ? 3 : 0}
        style={{
          gridColumn: mediaIndex < 3 ? 3 : 4,
          gridRow: mediaIndex < 3 ? 3 : 'auto',
          opacity: opacityCell
        }}
      >
        <Text muted size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          {isImageAsset(asset) && getAssetResolution(asset)}
        </Text>
      </Box>

      {/* MIME type */}
      <Box
        style={{
          display: mediaIndex < 3 ? 'none' : 'block',
          gridColumn: 5,
          gridRow: 'auto',
          opacity: opacityCell
        }}
      >
        <Text muted size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          {asset.mimeType}
        </Text>
      </Box>

      {/* Size */}
      <Box
        style={{
          display: mediaIndex < 3 ? 'none' : 'block',
          gridColumn: 6,
          gridRow: 'auto',
          opacity: opacityCell
        }}
      >
        <Text muted size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          {filesize(asset.size, {base: 10, round: 0})}
        </Text>
      </Box>

      {/* Last updated */}
      <Box
        marginLeft={mediaIndex < 3 ? 3 : 0}
        style={{
          gridColumn: mediaIndex < 3 ? 3 : 7,
          gridRow: mediaIndex < 3 ? 4 : 'auto',
          opacity: opacityCell
        }}
      >
        <Text muted size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          {formatRelative(new Date(asset._updatedAt), new Date())}
        </Text>
      </Box>

      {/* References */}
      <Box
        style={{
          display: mediaIndex < 3 ? 'none' : 'block',
          gridColumn: 8,
          gridRow: 'auto',
          opacity: opacityCell
        }}
      >
        <Text muted size={1} style={{lineHeight: '2em'}} textOverflow="ellipsis">
          {referenceCountVisible ? (
            <WithReferringDocuments id={id}>
              {({isLoading, referringDocuments}) => {
                const uniqueDocuments = getUniqueDocuments(referringDocuments)
                return isLoading ? (
                  <>-</>
                ) : (
                  <>{Array.isArray(uniqueDocuments) ? uniqueDocuments.length : 0}</>
                )
              }}
            </WithReferringDocuments>
          ) : (
            <>-</>
          )}
        </Text>
      </Box>

      {/* Error */}
      <Flex
        align="center"
        justify="center"
        style={{
          gridColumn: mediaIndex < 3 ? 4 : 9,
          gridRowStart: '1',
          gridRowEnd: mediaIndex < 3 ? 'span 5' : 'auto',
          opacity: opacityCell
        }}
      >
        {/* TODO: DRY */}
        {/* Error button */}
        {error && (
          <Box padding={2}>
            <Tooltip
              animate
              content={
                <Container padding={2} width={0}>
                  <Text size={1}>{error}</Text>
                </Container>
              }
              placement="left"
              portal
            >
              <Text size={1}>
                <StyledWarningIcon color="critical" />
              </Text>
            </Tooltip>
          </Box>
        )}
      </Flex>
    </ContainerGrid>
  )
}

export default memo(TableRowAsset)
