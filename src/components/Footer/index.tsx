import {Box, Button, Inline, Text} from '@sanity/ui'
import pluralize from 'pluralize'
import React from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {Flex as LegacyFlex} from 'theme-ui'

import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsDeletePicked, assetsPickClear} from '../../modules/assets'

const Container = styled(Box)(({theme}) => {
  return {
    // TODO: there must be a better way to select
    borderTop: `1px solid ${theme.sanity.color.muted.default.disabled.border}`
  }
})

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
      <Container
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
            <Button fontSize={1} mode="bleed" onClick={handlePickClear} text="Deselect" />
            <Button
              fontSize={1}
              mode="bleed"
              onClick={handleDeletePicked}
              text="Delete"
              tone="critical"
            />
          </Inline>
        </LegacyFlex>
      </Container>
    )
  }

  return null
}

export default Footer
