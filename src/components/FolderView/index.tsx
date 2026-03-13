import {Box, Button, Flex, Inline, Label, Text} from '@sanity/ui'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {foldersActions, selectFolderTree, selectUnfiledCount} from '../../modules/folders'
import {useDispatch} from 'react-redux'

const FolderView = () => {
  const dispatch = useDispatch()
  const currentFolderPath = useTypedSelector(state => state.folders.currentFolderPath)
  const currentFolderUnfiled = useTypedSelector(state => state.folders.currentFolderUnfiled)
  const fetching = useTypedSelector(state => state.folders.fetching)
  const folderTree = useTypedSelector(selectFolderTree)
  const totalAssets = useTypedSelector(state => state.folders.assignedPaths.length)
  const unfiledCount = useTypedSelector(selectUnfiledCount)

  return (
    <Flex direction="column" flex={1} height="fill">
      <Flex
        align="center"
        justify="space-between"
        paddingLeft={3}
        style={{
          borderBottom: '1px solid var(--card-border-color)',
          flexShrink: 0,
          height: `${PANEL_HEIGHT}px`
        }}
      >
        <Inline space={2}>
          <Label size={0}>Folders</Label>
          {fetching && (
            <Label size={0} style={{opacity: 0.3}}>
              Loading...
            </Label>
          )}
        </Inline>
      </Flex>

      <Box padding={2}>
        <Button
          fontSize={1}
          mode={!currentFolderPath && !currentFolderUnfiled ? 'default' : 'bleed'}
          onClick={() => dispatch(foldersActions.currentFolderClear())}
          style={{justifyContent: 'flex-start', width: '100%'}}
          text={`All assets (${totalAssets})`}
        />

        {(unfiledCount > 0 || currentFolderUnfiled) && (
          <Button
            fontSize={1}
            mode={currentFolderUnfiled ? 'default' : 'bleed'}
            onClick={() => dispatch(foldersActions.currentFolderShowUnfiled())}
            style={{justifyContent: 'flex-start', width: '100%'}}
            text={`Unfiled (${unfiledCount})`}
          />
        )}

        {folderTree.length === 0 && !fetching && (
          <Box padding={3}>
            <Text muted size={1}>
              <em>No folders</em>
            </Text>
          </Box>
        )}

        {folderTree.map(folder => (
          <Box key={folder.path} paddingLeft={folder.depth * 3}>
            <Button
              fontSize={1}
              mode={currentFolderPath === folder.path ? 'default' : 'bleed'}
              onClick={() => dispatch(foldersActions.currentFolderSet({folderPath: folder.path}))}
              style={{justifyContent: 'flex-start', width: '100%'}}
              text={`${folder.name} (${folder.totalCount})`}
            />
          </Box>
        ))}
      </Box>
    </Flex>
  )
}

export default FolderView
