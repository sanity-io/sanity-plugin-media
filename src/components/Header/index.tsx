import {CloseIcon, Icon, UploadIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Text} from '@sanity/ui'
import pluralize from 'pluralize'
import React from 'react'
import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import {useDropzoneActions} from '../../contexts/DropzoneDispatchContext'
import useTypedSelector from '../../hooks/useTypedSelector'

type Props = {
  onClose?: () => void
}

const Header = (props: Props) => {
  const {onClose} = props

  const {open} = useDropzoneActions()
  const {onSelect} = useAssetSourceActions()

  // Redux
  const assetTypes = useTypedSelector(state => state.assets.assetTypes)
  const selectedDocument = useTypedSelector(state => state.selected.document)

  // Row: Current document / close button
  return (
    <Box paddingY={2}>
      <Flex align="center" justify="space-between">
        {/* Label */}
        <Box flex={1} marginX={3}>
          <Inline style={{whiteSpace: 'nowrap'}}>
            <Text textOverflow="ellipsis" weight="semibold">
              <span>{onSelect ? `Insert ${assetTypes.join(' or ')}` : 'Browse Assets'}</span>
            </Text>

            {selectedDocument && (
              <Box display={['none', 'none', 'block']}>
                <Text>
                  <span style={{margin: '0 0.5em'}}>
                    <Icon symbol="arrow-right" />
                  </span>
                  <span style={{textTransform: 'capitalize'}}>{selectedDocument._type}</span>
                </Text>
              </Box>
            )}
          </Inline>
        </Box>

        <Flex marginX={2}>
          {/* Upload */}
          <Button
            fontSize={1}
            icon={UploadIcon}
            mode="bleed"
            onClick={open}
            text={`Upload ${assetTypes.length === 1 ? pluralize(assetTypes[0]) : 'assets'}`}
            tone="primary"
          />

          {/* Close */}
          {onClose && (
            <Box style={{flexShrink: 0}}>
              <Button
                disabled={!onClose}
                icon={CloseIcon}
                mode="bleed"
                onClick={onClose}
                radius={2}
              />
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header
