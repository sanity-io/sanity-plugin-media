import {Box, Button, Flex, Label} from '@sanity/ui'
import pluralize from 'pluralize'
import {useDispatch} from 'react-redux'
import {useColorSchemeValue} from 'sanity'
import {PANEL_HEIGHT} from '../../constants'
import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions, selectAssetsPicked} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'
import {getSchemeColor} from '../../utils/getSchemeColor'

const PickedBar = () => {
  const scheme = useColorSchemeValue()

  // Redux
  const dispatch = useDispatch()
  const assetsPicked = useTypedSelector(selectAssetsPicked)
  const currentFolderId = useTypedSelector(state => state.folders.currentFolderId)
  const {isMultiSelect, onSelect} = useAssetSourceActions()
  // Callbacks
  const handlePickClear = () => {
    dispatch(assetsActions.pickClear())
  }

  const handleDeletePicked = () => {
    dispatch(dialogActions.showConfirmDeleteAssets({assets: assetsPicked}))
  }

  const handleMovePicked = () =>
    dispatch(DIALOG_ACTIONS.showFolderMove({assets: assetsPicked, folderId: currentFolderId}))

  const handleRemovePickedFromFolder = () =>
    dispatch(assetsActions.folderSetRequest({assets: assetsPicked, folderId: null}))

  const handleInsertPicked = () => {
    if (!onSelect) {
      return
    }

    const pickedAssetIds = assetsPicked.map(item => ({
      kind: 'assetDocumentId' as const,
      value: item.asset._id
    }))

    if (pickedAssetIds.length === 0) {
      return
    }

    onSelect(pickedAssetIds)
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

        {onSelect && isMultiSelect ? (
          <Button
            mode="bleed"
            onClick={handleInsertPicked}
            padding={2}
            style={{background: 'none', boxShadow: 'none'}}
            tone="primary"
          >
            <Label size={0}>Insert selected</Label>
          </Button>
        ) : (
          <Button
            mode="bleed"
            onClick={handleDeletePicked}
            padding={2}
            style={{background: 'none', boxShadow: 'none'}}
            tone="critical"
          >
            <Label size={0}>Delete</Label>
          </Button>
        )}

        {!onSelect && (
          <>
            <Button
              mode="bleed"
              onClick={handleMovePicked}
              padding={2}
              style={{background: 'none', boxShadow: 'none'}}
              tone="primary"
            >
              <Label size={0}>Move to folder</Label>
            </Button>
            {currentFolderId && (
              <Button
                mode="bleed"
                onClick={handleRemovePickedFromFolder}
                padding={2}
                style={{background: 'none', boxShadow: 'none'}}
                tone="critical"
              >
                <Label size={0}>Remove from folder</Label>
              </Button>
            )}
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default PickedBar
