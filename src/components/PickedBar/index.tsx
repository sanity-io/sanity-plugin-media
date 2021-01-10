import {Box, Button, Flex, Inline, Text} from '@sanity/ui'
import pluralize from 'pluralize'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogShowDeleteConfirm} from '../../modules/dialog'
import {assetsPickClear} from '../../modules/assets'

const Container = styled(Box)(({theme}) => {
  return {
    background: theme.sanity.color.base.bg,
    borderBottom: `1px solid ${theme.sanity.color.muted.default.disabled.border}`,
    position: 'relative',
    width: '100vw'
  }
})

const PickedBar: FC = () => {
  // Redux
  const dispatch = useDispatch()
  const byIds = useTypedSelector(state => state.assets.byIds)

  const items = byIds ? Object.values(byIds) : []

  const picked = items && items.filter(item => item?.picked)

  /*
  const handleDownloadOriginal = (asset: Asset) => {
    window.location.href = `${asset.url}?dl`
  }

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
    // TODO: consider creating dedicated action for delete confirmation on picked / multiple items
    dispatch(dialogShowDeleteConfirm())
  }

  if (picked.length > 0) {
    return (
      <Container paddingX={3} paddingY={2}>
        <Flex align="center" justify="flex-start">
          <Inline space={2}>
            <Box marginRight={2}>
              <Text size={1}>
                {picked.length} {pluralize('asset', picked.length)} selected
              </Text>
            </Box>
            {/* Deselect button */}
            <Button fontSize={1} mode="bleed" onClick={handlePickClear} text="Deselect" />
            {/* Delete button */}
            <Button
              fontSize={1}
              mode="bleed"
              onClick={handleDeletePicked}
              text="Delete"
              tone="critical"
            />
          </Inline>
        </Flex>
      </Container>
    )
  }

  return null
}

export default PickedBar
