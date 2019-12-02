import filesize from 'filesize'
import ButtonGroup from 'part:@sanity/components/buttons/button-group'
import Button from 'part:@sanity/components/buttons/default'
import React from 'react'
import {IoIosClose, IoIosLink, IoIosReturnRight} from 'react-icons/io'

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

  return (
    <Box
      alignItems="center"
      bg="darkestGray"
      bottom={0}
      color="lightGray"
      display="flex"
      flexWrap="wrap"
      height={['headerHeight2x', 'headerHeight']}
      justifyContent="space-between"
      left={0}
      position="fixed"
      width="100%"
    >
      {/* LHS */}
      <Box flex="3 0" height="headerHeight" order={[2, 0]}>
        {onSelect && singlePickedAsset && (
          <Button
            bleed={true}
            icon={IoIosReturnRight.bind(null, {size: 22})}
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
            <strong>Insert</strong>
          </Button>
        )}
      </Box>

      {/* Center */}
      <Box height="headerHeight" order={[0, 1]} overflow="hidden" px={2} width={['100%', 'auto']}>
        {singlePickedAsset && (
          <Box
            alignItems="center"
            display="flex"
            height="100%"
            justifyContent="center"
            whiteSpace="nowrap"
          >
            <Box
              borderColor="gray"
              borderStyle="solid"
              borderWidth="1px"
              borderRadius="2px"
              color="gray"
              fontSize={1}
              px={1}
            >
              {singlePickedAsset.extension.toUpperCase()}
            </Box>

            <Box ml={2}>{singlePickedAsset.originalFilename}</Box>

            {singlePickedAsset.metadata?.dimensions && (
              <Box color="darkGray" ml={3}>
                {singlePickedAsset.metadata.dimensions.width} x{' '}
                {singlePickedAsset.metadata.dimensions.height}
              </Box>
            )}

            <Box color="darkGray" ml={3}>
              {filesize(singlePickedAsset.size, {round: 0})}
            </Box>
          </Box>
        )}

        {picked.length > 1 && (
          <Box alignItems="center" color="lightGray" display="flex" height="headerHeight">
            {picked.length} selected
          </Box>
        )}
      </Box>

      {/* RHS */}
      <Box display="flex" flex="3 0" height="headerHeight" justifyContent="flex-end" order={[2, 2]}>
        <ButtonGroup>
          {singlePickedAsset && (
            <Button
              bleed={true}
              kind="simple"
              onClick={onDialogShowRefs.bind(null, singlePickedAsset)}
              ripple={false}
              style={{
                borderRadius: 0
              }}
            >
              <IoIosLink size={16} />
            </Button>
          )}

          {picked.length > 0 && (
            <Button
              bleed={true}
              color="danger"
              icon={IoIosClose.bind(null, {size: 24})}
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
