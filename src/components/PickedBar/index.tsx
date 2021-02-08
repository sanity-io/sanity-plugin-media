import {Box, Button, Flex, Inline, Label} from '@sanity/ui'
import pluralize from 'pluralize'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogShowDeleteConfirm} from '../../modules/dialog'
import {assetsPickClear, selectAssetsPicked} from '../../modules/assets'

const Container = styled(Box)(({theme}) => {
  return {
    // background: theme.sanity.color.base.bg,
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
    // TODO: consider creating dedicated action for delete confirmation on picked / multiple items
    dispatch(
      dialogShowDeleteConfirm({
        documentType: 'asset'
      })
    )
  }

  return (
    <Container>
      <Flex
        align="center"
        justify="flex-start"
        paddingX={3}
        style={{
          height: '2.2em'
        }}
      >
        {picked.length > 0 ? (
          <Inline space={1}>
            <Box marginRight={2}>
              <Label size={0}>
                {picked.length} {pluralize('asset', picked.length)} selected
              </Label>
            </Box>

            {/* Deselect button */}
            <Button mode="bleed" onClick={handlePickClear}>
              <Box padding={2}>
                <Label size={0}>Deselect</Label>
              </Box>
            </Button>

            {/* Delete button */}
            <Button mode="bleed" onClick={handleDeletePicked} tone="critical">
              <Box padding={2}>
                <Label size={0}>Delete</Label>
              </Box>
            </Button>
          </Inline>
        ) : (
          <Box paddingY={2}>
            <Label muted size={0}>
              {/* TODO: asset count */}
            </Label>
          </Box>
        )}
      </Flex>
    </Container>
  )
}

export default PickedBar
