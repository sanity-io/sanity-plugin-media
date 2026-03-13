import {Box, Button, Inline, Text} from '@sanity/ui'
import useTypedSelector from '../../hooks/useTypedSelector'
import {
  foldersActions,
  selectCurrentFolderSegments,
  selectUnfiledCount
} from '../../modules/folders'
import {useDispatch} from 'react-redux'

const FolderBreadcrumbs = () => {
  const dispatch = useDispatch()
  const currentFolderPath = useTypedSelector(state => state.folders.currentFolderPath)
  const currentFolderUnfiled = useTypedSelector(state => state.folders.currentFolderUnfiled)
  const segments = useTypedSelector(selectCurrentFolderSegments)
  const unfiledCount = useTypedSelector(selectUnfiledCount)

  if (!currentFolderPath && !currentFolderUnfiled && unfiledCount === 0) {
    return null
  }

  return (
    <Box marginTop={2} paddingX={2}>
      <Inline space={1}>
        <Button
          fontSize={1}
          mode={!currentFolderPath && !currentFolderUnfiled ? 'default' : 'bleed'}
          onClick={() => dispatch(foldersActions.currentFolderClear())}
          text="Home"
        />

        {currentFolderUnfiled && (
          <Button
            fontSize={1}
            mode="default"
            onClick={() => dispatch(foldersActions.currentFolderShowUnfiled())}
            text={`Unfiled (${unfiledCount})`}
          />
        )}

        {segments.map(segment => (
          <Inline key={segment.path} space={1}>
            <Text muted size={1}>
              /
            </Text>
            <Button
              fontSize={1}
              mode={currentFolderPath === segment.path ? 'default' : 'bleed'}
              onClick={() => dispatch(foldersActions.currentFolderSet({folderPath: segment.path}))}
              text={segment.name}
            />
          </Inline>
        ))}
      </Inline>
    </Box>
  )
}

export default FolderBreadcrumbs
