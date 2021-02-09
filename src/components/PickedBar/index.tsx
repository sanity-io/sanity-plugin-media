import {Box, Button, Flex, Inline, Text} from '@sanity/ui'
import pluralize from 'pluralize'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogShowDeleteConfirm} from '../../modules/dialog'
import {assetsPickClear, selectAssetsPicked} from '../../modules/assets'

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
  const picked = useTypedSelector(selectAssetsPicked)

  // Callbacks
  const handlePickClear = () => {
    dispatch(assetsPickClear())
  }

  const handleDeletePicked = () => {
    dispatch(
      dialogShowDeleteConfirm({
        documentType: 'asset'
      })
    )
  }

  if (picked.length === 0) {
    return null
  }

  return (
    <Container>
      <Flex align="center" justify="flex-start" paddingX={3} paddingY={2}>
        <Inline space={1}>
          <Box marginRight={2}>
            <Text size={1}>
              {picked.length} {pluralize('asset', picked.length)} selected
            </Text>
          </Box>

          {/* Deselect button */}
          <Button
            fontSize={1}
            mode="bleed"
            onClick={handlePickClear}
            // padding={2}
            text="Deselect"
          />

          {/* Delete button */}
          <Button
            fontSize={1}
            mode="bleed"
            onClick={handleDeletePicked}
            // padding={2}
            text="Delete"
            tone="critical"
          />
        </Inline>
      </Flex>
    </Container>
  )
}

export default PickedBar
