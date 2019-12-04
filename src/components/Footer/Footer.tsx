import filesize from 'filesize'
import ButtonGroup from 'part:@sanity/components/buttons/button-group'
import Button from 'part:@sanity/components/buttons/default'
import React from 'react'
import {IoIosDownload, IoIosLink, IoIosReturnRight} from 'react-icons/io'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import Box from '../../styled/Box'
import {Asset} from '../../types'

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
      color="lightGray"
      display="flex"
      flexWrap="wrap"
      height={['headerHeight.0', 'headerHeight.1']}
      justifyContent="space-between"
      left={0}
      position="fixed"
      width="100%"
    >
      {/* LHS */}
      <Box flex="3 0" height="headerHeight.1" order={[2, 0]}>
        {onSelect && singlePickedAsset && (
          <Button
            bleed={true}
            icon={IoIosReturnRight.bind(null, {size: 20})}
            kind="simple"
            onClick={() => {
              onSelect([
                {
                  kind: 'assetDocumentId',
                  value: singlePickedAsset._id
                }
              ])
            }}
            ripple={false}
          >
            <strong>Select</strong>
          </Button>
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
              ml={[2, 0]}
              minWidth={0}
              whiteSpace="nowrap"
            >
              {/* Original filename */}
              <Box
                color="gray"
                maxWidth={['200px', '420px']}
                mx={2}
                overflow="hidden"
                textOverflow="ellipsis"
              >
                <strong>{singlePickedAsset.originalFilename}</strong>
              </Box>

              {/* Dimensions */}
              {singlePickedAsset.metadata?.dimensions && (
                <Box color="gray" mx={2}>
                  {singlePickedAsset.metadata.dimensions.width} x{' '}
                  {singlePickedAsset.metadata.dimensions.height}
                </Box>
              )}

              {/* Filesize */}
              <Box color="gray" mx={2}>
                {filesize(singlePickedAsset.size, {round: 0})}
              </Box>

              {/* File extension */}
              <Box
                borderColor="gray"
                borderStyle="solid"
                borderWidth="1px"
                borderRadius="2px"
                color="gray"
                display={['none', 'block']}
                fontSize={1}
                mx={2}
                px={1}
              >
                {singlePickedAsset.extension.toUpperCase()}
              </Box>
            </Box>

            <Box display="flex" height="100%">
              <ButtonGroup>
                {/* Show references */}
                <Button
                  kind="simple"
                  onClick={onDialogShowRefs.bind(null, singlePickedAsset)}
                  ripple={false}
                  style={{
                    borderRadius: 0
                  }}
                >
                  <IoIosLink size={16} />
                </Button>
                {/* Download original */}
                <Button
                  kind="simple"
                  onClick={handleDownloadOriginal.bind(null, singlePickedAsset)}
                  ripple={false}
                  style={{
                    borderRadius: 0
                  }}
                >
                  <IoIosDownload size={16} />
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        )}

        {picked.length > 1 && (
          <Box alignItems="center" color="lightGray" display="flex" height="headerHeight.1" mx={3}>
            {picked.length} images selected
          </Box>
        )}
      </Box>

      {/* RHS */}
      <Box
        display="flex"
        flex="3 0"
        height="headerHeight.1"
        justifyContent="flex-end"
        order={[2, 2]}
      >
        <ButtonGroup>
          {picked.length > 0 && (
            <Button
              bleed={true}
              color="danger"
              kind="simple"
              onClick={onDeletePicked}
              ripple={false}
              style={{
                borderRadius: 0
              }}
            >
              <strong>Delete{picked.length > 1 ? ` ${picked.length} images` : ''}</strong>
            </Button>
          )}
        </ButtonGroup>
      </Box>
    </Box>
  )
}

export default Footer
