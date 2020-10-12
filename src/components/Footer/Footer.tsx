import filesize from 'filesize'
import React from 'react'
import {IoIosDownload, IoIosLink} from 'react-icons/io'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import Box from '../../styled/Box'
import {Asset} from '../../types'
import Button from '../Button/Button'

const Footer = () => {
  const {onDeletePicked, onDialogShowRefs, onSelect} = useAssetBrowserActions()
  const {items} = useAssetBrowserState()

  const picked = items && items.filter(item => item.picked)
  const singlePickedAsset: Asset | undefined =
    picked && picked.length === 1 ? picked[0]?.asset : undefined

  const handleDownloadOriginal = (asset: Asset) => {
    window.location.href = `${asset.url}?dl`
  }

  return (
    <Box
      alignItems="center"
      bg="darkestGray"
      bottom={0}
      display="flex"
      flexWrap="wrap"
      height={['headerHeight.0', 'headerHeight.1']}
      justifyContent="space-between"
      left={0}
      position="fixed"
      textColor="lighterGray"
      width="100%"
    >
      {/* LHS */}
      <Box alignItems="center" display="flex" flex="3 0" height="headerHeight.1" order={[2, 0]}>
        {onSelect && singlePickedAsset && (
          <Box display="flex">
            <Button
              onClick={() => {
                onSelect([
                  {
                    kind: 'assetDocumentId',
                    value: singlePickedAsset._id
                  }
                ])
              }}
            >
              <strong>Select</strong>
            </Button>
          </Box>
        )}
      </Box>

      {/* Center */}
      <Box height="headerHeight.1" order={[0, 1]} overflow="hidden" width={['100%', 'auto']}>
        {singlePickedAsset && (
          <Box
            alignItems="center"
            display="flex"
            height="100%"
            justifyContent={['space-between', 'center']}
            width="100%"
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              ml={[1, 0]}
              minWidth={0}
              whiteSpace="nowrap"
            >
              {/* Original filename */}
              <Box
                maxWidth={[null, '420px']}
                mx={2}
                overflow="hidden"
                textColor="lightGray"
                textOverflow="ellipsis"
              >
                <strong>{singlePickedAsset.originalFilename}</strong>
              </Box>

              {/* Dimensions */}
              {singlePickedAsset.metadata?.dimensions && (
                <Box color="lightGray" mx={2}>
                  {singlePickedAsset.metadata.dimensions.width} x{' '}
                  {singlePickedAsset.metadata.dimensions.height}
                </Box>
              )}

              {/* Filesize */}
              <Box color="lightGray" mx={2}>
                {filesize(singlePickedAsset.size, {round: 0})}
              </Box>

              {/* File extension */}
              <Box
                borderColor="lightGray"
                borderStyle="solid"
                borderWidth="1px"
                borderRadius="2px"
                display={['none', 'block']}
                fontSize={1}
                mx={2}
                px={1}
                textColor="lightGray"
              >
                {singlePickedAsset.extension.toUpperCase()}
              </Box>
            </Box>

            <Box alignItems="center" display="flex" height="100%" ml={[0, 2]}>
              {/* Show references */}
              <Button
                icon={IoIosLink({size: 16})}
                onClick={onDialogShowRefs.bind(null, singlePickedAsset)}
              />
              {/* Download original */}
              <Button
                icon={IoIosDownload({size: 16})}
                onClick={handleDownloadOriginal.bind(null, singlePickedAsset)}
              />
            </Box>
          </Box>
        )}

        {picked.length > 1 && (
          <Box
            alignItems="center"
            display="flex"
            height="headerHeight.1"
            mx={3}
            textColor="lighterGray"
          >
            {picked.length} images selected
          </Box>
        )}
      </Box>

      {/* RHS */}
      <Box
        alignItems="center"
        display="flex"
        flex="3 0"
        height="headerHeight.1"
        justifyContent="flex-end"
        order={[2, 2]}
      >
        {picked.length > 0 && (
          <Box display="flex" height="100%">
            <Button onClick={onDeletePicked} variant="danger">
              <strong>Delete{picked.length > 1 ? ` ${picked.length} images` : ''}</strong>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Footer
