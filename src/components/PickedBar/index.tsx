import {Box, Button, Flex, Label} from '@sanity/ui'
import pluralize from 'pluralize'
import React, {Fragment} from 'react'
import {useDispatch} from 'react-redux'
import {useColorScheme} from 'sanity'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions, selectAssetsPicked} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {getSchemeColor} from '../../utils/getSchemeColor'
import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'

const PickedBar = () => {
  const selectionType = useTypedSelector(state => state.selectionType)
  const {onSelect} = useAssetSourceActions()
  const {scheme} = useColorScheme()

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

  const handleInsertPicked = () => {
    if (!onSelect) {
      // This should never happen, since the rendering logic makes sure onSelect is defined
      console.error('onSelect is not defined')
      return
    }

    const assetIds = assetsPicked.map(({asset}) => asset._id)
    const onSelectItems = assetIds.map(id => ({kind: 'assetDocumentId' as const, value: id}))
    onSelect(onSelectItems)
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

        {onSelect && selectionType === 'multiple' ? (
          <Fragment>
            <Button tone="primary" onClick={handleInsertPicked} padding={2}>
              <Label size={0}>Insert images</Label>
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Button
              mode="bleed"
              onClick={handlePickClear}
              padding={2}
              style={{background: 'none', boxShadow: 'none'}}
              tone="default"
            >
              <Label size={0}>Deselect</Label>
            </Button>

            <Button
              mode="bleed"
              onClick={handleDeletePicked}
              padding={2}
              style={{background: 'none', boxShadow: 'none'}}
              tone="critical"
            >
              <Label size={0}>Delete</Label>
            </Button>
          </Fragment>
        )}
      </Flex>
    </Flex>
  )
}

export default PickedBar
