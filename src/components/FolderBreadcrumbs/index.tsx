import {Box, Button, Inline, Text} from '@sanity/ui'
import useTypedSelector from '../../hooks/useTypedSelector'
import {foldersActions, selectCurrentFolderSegments} from '../../modules/folders'
import {useDispatch} from 'react-redux'

const FolderBreadcrumbs = () => {
  const dispatch = useDispatch()
  const currentFolderId = useTypedSelector(state => state.folders.currentFolderId)
  const segments = useTypedSelector(selectCurrentFolderSegments)
  if (!currentFolderId) {
    return null
  }

  return (
    <Box display={['block', 'block', 'none']} padding={2}>
      <Inline space={1}>
        <Button
          fontSize={1}
          padding={2}
          mode="bleed"
          onClick={() => dispatch(foldersActions.currentFolderClear())}
          text="All assets"
        />

        {segments.map(segment => (
          <Inline key={segment.id} space={1}>
            <Text muted size={1}>
              /
            </Text>
            <Button
              fontSize={1}
              padding={2}
              mode={currentFolderId === segment.id ? 'default' : 'bleed'}
              onClick={() => dispatch(foldersActions.currentFolderSet({folderId: segment.id}))}
              text={segment.name}
            />
          </Inline>
        ))}
      </Inline>
    </Box>
  )
}

export default FolderBreadcrumbs
