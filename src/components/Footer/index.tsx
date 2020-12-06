import {Box, Button, Card, Inline, Text} from '@sanity/ui'
import pluralize from 'pluralize'
import React from 'react'
import {useDispatch} from 'react-redux'
import {Flex as LegacyFlex} from 'theme-ui'

import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsDeletePicked, assetsPickClear} from '../../modules/assets'

const Footer = () => {
  // Redux
  const dispatch = useDispatch()
  const byIds = useTypedSelector(state => state.assets.byIds)

  const items = byIds ? Object.values(byIds) : []

  const picked = items && items.filter(item => item.picked)

  /*
  const handleDownloadOriginal = (asset: Asset) => {
    window.location.href = `${asset.url}?dl`
  }

  // Show references
  <Button
    icon={IoIosLink({size: 16})}
    onClick={() => dispatch(dialogShowRefs(singlePickedAsset))}
  />
  // Download original
  <Button
    icon={IoIosDownload({size: 16})}
    onClick={handleDownloadOriginal.bind(null, singlePickedAsset)}
  />
  */

  // Callbacks
  const handlePickClear = () => {
    dispatch(assetsPickClear())
  }

  const handleDeletePicked = () => {
    dispatch(assetsDeletePicked())
  }

  if (picked.length > 0) {
    return (
      <Card
        paddingX={3}
        style={{
          bottom: 0,
          left: 0,
          position: 'fixed',
          width: '100%'
        }}
      >
        <LegacyFlex
          sx={{
            alignItems: 'center',
            height: 'headerRowHeight1x',
            justifyContent: 'center'
          }}
        >
          <Inline space={2}>
            <Box marginRight={2}>
              <Text size={1}>
                {picked.length} {pluralize('image', picked.length)} selected
              </Text>
            </Box>
            <Button
              // icon="revert"
              mode="bleed"
              onClick={handlePickClear}
              size={1}
              text="Deselect"
            />
            <Button
              mode="bleed"
              onClick={handleDeletePicked}
              size={1}
              text="Delete"
              tone="critical"
            />
          </Inline>
        </LegacyFlex>
      </Card>
    )
  }

  return null
}

export default Footer
