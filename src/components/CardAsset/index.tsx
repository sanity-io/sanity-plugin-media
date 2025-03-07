import {CheckmarkCircleIcon, EditIcon, WarningFilledIcon} from '@sanity/icons'
import {
  Box,
  Checkbox,
  Container,
  Flex,
  Spinner,
  Text,
  type Theme,
  type ThemeColorSchemeKey,
  Tooltip
} from '@sanity/ui'
import {memo, type MouseEvent, type RefObject} from 'react'
import {useDispatch} from 'react-redux'
import {useColorSchemeValue} from 'sanity'
import {styled, css} from 'styled-components'
import {PANEL_HEIGHT} from '../../constants'
import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import useKeyPress from '../../hooks/useKeyPress'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions, selectAssetById} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import imageDprUrl from '../../utils/imageDprUrl'
import {isFileAsset, isImageAsset} from '../../utils/typeGuards'
import FileIcon from '../FileIcon'
import Image from '../Image'
import {getSchemeColor} from '../../utils/getSchemeColor'

type Props = {
  id: string
  selected: boolean
}

const CardWrapper = styled(Flex)`
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
`

const CardContainer = styled(Flex)<{$picked?: boolean; theme: Theme; $updating?: boolean}>(
  ({$picked, theme, $updating}) => {
    return css`
      border: 1px solid transparent;
      height: 100%;
      pointer-events: ${$updating ? 'none' : 'auto'};
      position: relative;
      transition: all 300ms;
      user-select: none;
      width: 100%;

      border: ${$picked
        ? `1px solid ${theme.sanity.color.spot.orange} !important`
        : '1px solid inherit'};

      ${!$updating &&
      css`
        @media (hover: hover) and (pointer: fine) {
          &:hover {
            border: 1px solid var(--card-border-color);
          }
        }
      `}
    `
  }
)

const ContextActionContainer = styled<typeof Flex, {$scheme: ThemeColorSchemeKey}>(Flex)(
  ({$scheme}) => {
    return css`
      cursor: pointer;
      height: ${PANEL_HEIGHT}px;
      transition: all 300ms;
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          background: ${getSchemeColor($scheme, 'bg')};
        }
      }
    `
  }
)

const StyledWarningOutlineIcon = styled(WarningFilledIcon)(({theme}) => {
  return {
    color: theme.sanity.color.spot.red
  }
})

const CardAsset = (props: Props) => {
  const {id, selected} = props

  const scheme = useColorSchemeValue()

  // Refs
  const shiftPressed: RefObject<boolean> = useKeyPress('shift')

  // Redux
  const dispatch = useDispatch()
  const lastPicked = useTypedSelector(state => state.assets.lastPicked)
  const item = useTypedSelector(state => selectAssetById(state, id))

  const asset = item?.asset
  const error = item?.error
  const isOpaque = item?.asset?.metadata?.isOpaque
  const picked = item?.picked
  const updating = item?.updating

  const {onSelect} = useAssetSourceActions()

  // Short circuit if no asset is available
  if (!asset) {
    return null
  }

  // Callbacks
  const handleAssetClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    if (onSelect) {
      onSelect([
        {
          kind: 'assetDocumentId',
          value: asset._id
        }
      ])
    } else if (shiftPressed.current) {
      if (picked) {
        dispatch(assetsActions.pick({assetId: asset._id, picked: !picked}))
      } else {
        dispatch(assetsActions.pickRange({startId: lastPicked || asset._id, endId: asset._id}))
      }
    } else {
      dispatch(dialogActions.showAssetEdit({assetId: asset._id}))
    }
  }

  const handleContextActionClick = (e: MouseEvent) => {
    e.stopPropagation()

    if (onSelect) {
      dispatch(dialogActions.showAssetEdit({assetId: asset._id}))
    } else if (shiftPressed.current && !picked) {
      dispatch(assetsActions.pickRange({startId: lastPicked || asset._id, endId: asset._id}))
    } else {
      dispatch(assetsActions.pick({assetId: asset._id, picked: !picked}))
    }
  }

  const opacityContainer = updating ? 0.5 : 1
  const opacityPreview = selected || updating ? 0.25 : 1

  return (
    <CardWrapper padding={1}>
      <CardContainer direction="column" $picked={picked} $updating={item.updating}>
        {/* Image */}
        <Box
          flex={1}
          style={{
            cursor: selected ? 'default' : 'pointer',
            position: 'relative'
          }}
        >
          <div onClick={handleAssetClick} style={{height: '100%', opacity: opacityPreview}}>
            {/* File icon */}
            {isFileAsset(asset) && <FileIcon extension={asset.extension} width="80px" />}

            {/* Image */}
            {isImageAsset(asset) && (
              <Image
                draggable={false}
                $scheme={scheme}
                $showCheckerboard={!isOpaque}
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
                opacity: opacityContainer,
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
        <ContextActionContainer
          align="center"
          onClick={handleContextActionClick}
          paddingX={1}
          $scheme={scheme}
          style={{opacity: opacityContainer}}
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
                flexShrink: 0,
                pointerEvents: 'none',
                transform: 'scale(0.8)'
              }}
            />
          )}

          <Box marginLeft={2}>
            <Text muted size={0} textOverflow="ellipsis">
              {asset.originalFilename}
            </Text>
          </Box>
        </ContextActionContainer>

        {/* TODO: DRY */}
        {/* Error button */}
        {error && (
          <Box
            padding={3}
            style={{
              position: 'absolute',
              right: 0,
              top: 0
            }}
          >
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
                <StyledWarningOutlineIcon color="critical" />
              </Text>
            </Tooltip>
          </Box>
        )}
      </CardContainer>
    </CardWrapper>
  )
}

export default memo(CardAsset)
