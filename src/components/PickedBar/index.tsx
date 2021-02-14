import {Box, Button, Flex, Inline, Text} from '@sanity/ui'
import pluralize from 'pluralize'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogActions} from '../../modules/dialog'
import {assetsActions, selectAssetsPicked} from '../../modules/assets'

const Container = styled(Box)(({theme}) => {
  return {
    borderTop: `1px solid ${theme.sanity.color.muted.default.disabled.border}`,
    position: 'relative',
    width: '100vw'
  }
})

const PickedBar: FC = () => {
  // Redux
  const dispatch = useDispatch()
  const assetsPicked = useTypedSelector(selectAssetsPicked)

  // Callbacks
  const handlePickClear = () => {
    dispatch(assetsActions.pickClear())
  }

  const handleDeletePicked = () => {
    dispatch(dialogActions.showConfirmDeleteAssetsPicked({assetsPicked}))
  }

  if (assetsPicked.length === 0) {
    return null
  }

  return (
    <Container>
      <Flex align="center" justify="flex-start" paddingX={3} paddingY={2}>
        <Inline space={1}>
          <Box marginRight={2}>
            <Text size={1}>
              {assetsPicked.length} {pluralize('asset', assetsPicked.length)} selected
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

export default PickedBar
