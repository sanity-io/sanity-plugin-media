import {Box, Button, Flex, Label} from '@sanity/ui'
import pluralize from 'pluralize'
import React from 'react'
import {useDispatch} from 'react-redux'
import {useColorSchemeValue} from 'sanity'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions, selectAssetsPicked} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {getSchemeColor} from '../../utils/getSchemeColor'

const PickedBar = () => {
  const scheme = useColorSchemeValue()

  // Redux
  const dispatch = useDispatch()
  const assetsPicked = useTypedSelector(selectAssetsPicked)

  // Callbacks
  const handlePickClear = () => {
    dispatch(assetsActions.pickClear())
  }

  const handleDeletePicked = () => {
    dispatch(dialogActions.showConfirmDeleteAssets({assets: assetsPicked}))
  }

  if (assetsPicked.length === 0) {
    return null
  }

  return (
    <Flex
      align="center"
      justify="flex-start"
      style={{
        background: getSchemeColor(scheme, 'bg'),
        borderBottom: '1px solid var(--card-border-color)',
        height: `${PANEL_HEIGHT}px`,
        position: 'relative',
        width: '100%'
      }}
    >
      <Flex align="center" paddingX={3}>
        <Box paddingRight={2}>
          <Label size={0} style={{color: 'inherit'}}>
            {assetsPicked.length} {pluralize('asset', assetsPicked.length)} selected
          </Label>
        </Box>

        {/* Deselect button */}
        <Button
          mode="bleed"
          onClick={handlePickClear}
          padding={2}
          style={{background: 'none', boxShadow: 'none'}}
          tone="default"
        >
          <Label size={0}>Deselect</Label>
        </Button>

        {/* Delete button */}
        <Button
          mode="bleed"
          onClick={handleDeletePicked}
          padding={2}
          style={{background: 'none', boxShadow: 'none'}}
          tone="critical"
        >
          <Label size={0}>Delete</Label>
        </Button>
      </Flex>
    </Flex>
  )
}

export default PickedBar
