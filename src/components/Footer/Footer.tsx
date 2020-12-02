import {Asset} from '@types'
import filesize from 'filesize'
import React from 'react'
import {IoIosDownload, IoIosLink} from 'react-icons/io'
import {useDispatch} from 'react-redux'

import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsDeletePicked} from '../../modules/assets'
import {dialogShowRefs} from '../../modules/dialog'
import Box from '../../styled/Box'
import Flex from '../../styled/Flex'
import Button from '../Button/Button'

const Footer = () => {
  const {onSelect} = useAssetSourceActions()

  // Redux
  const dispatch = useDispatch()
  const byIds = useTypedSelector(state => state.assets.byIds)

  const items = byIds ? Object.values(byIds) : []

  const picked = items && items.filter(item => item.picked)
  const singlePickedAsset: Asset | undefined =
    picked && picked.length === 1 ? picked[0]?.asset : undefined

  const handleDownloadOriginal = (asset: Asset) => {
    window.location.href = `${asset.url}?dl`
  }

  return (
    <Flex
      alignItems="center"
      bg="darkestGray"
      bottom={0}
      flexWrap="wrap"
      justifyContent="space-between"
      left={0}
      position="fixed"
      textColor="lighterGray"
      width="100%"
    >
      {/* LHS */}
      <Flex alignItems="center" flex="3 0" height="headerRowHeight" order={[2, 0]}>
        {/* Delete */}
        {picked.length > 0 && (
          <Flex height="100%">
            <Button onClick={() => dispatch(assetsDeletePicked())} variant="danger">
              Delete{picked.length > 1 ? ` ${picked.length} images` : ''}
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Center */}
      <Box height="headerRowHeight" order={[0, 1]} overflow="hidden" width={['100%', 'auto']}>
        {singlePickedAsset && (
          <Flex
            alignItems="center"
            height="100%"
            justifyContent={['space-between', 'center']}
            width="100%"
          >
            <Flex
              alignItems="center"
              flexDirection="row"
              ml={[2, 0]}
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
            </Flex>

            <Flex alignItems="center" height="100%" ml={[0, 2]}>
              {/* Show references */}
              <Button
                icon={IoIosLink({size: 16})}
                onClick={() => dispatch(dialogShowRefs(singlePickedAsset))}
              />
              {/* Download original */}
              <Button
                icon={IoIosDownload({size: 16})}
                onClick={handleDownloadOriginal.bind(null, singlePickedAsset)}
              />
            </Flex>
          </Flex>
        )}

        {picked.length > 1 && (
          <Flex alignItems="center" height="headerRowHeight" mx={3} textColor="lighterGray">
            {picked.length} images selected
          </Flex>
        )}
      </Box>

      {/* RHS */}
      <Flex
        alignItems="center"
        flex="3 0"
        height="headerRowHeight"
        justifyContent="flex-end"
        order={[2, 2]}
      >
        {/* Select */}
        {onSelect && singlePickedAsset && (
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
            Select
          </Button>
        )}
      </Flex>
    </Flex>
  )
}

export default Footer
