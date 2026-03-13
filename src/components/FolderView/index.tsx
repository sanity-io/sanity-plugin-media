import {Box, Button, Flex, Inline, Label, Text} from '@sanity/ui'
import {type MouseEvent, useEffect, useMemo, useState} from 'react'
import {useDispatch} from 'react-redux'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import type {FolderTreeNode} from '../../types'
import {foldersActions, selectFolderTree, selectUnfiledCount} from '../../modules/folders'

type FolderNodeProps = {
  currentFolderPath: string | null
  expandedPaths: Set<string>
  node: FolderTreeNode
  onSelect: (folderPath: string) => void
  onToggle: (folderPath: string) => void
}

const FolderNode = ({
  currentFolderPath,
  expandedPaths,
  node,
  onSelect,
  onToggle
}: FolderNodeProps) => {
  const expanded = expandedPaths.has(node.path)
  const hasChildren = node.children.length > 0
  const selected = currentFolderPath === node.path

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onToggle(node.path)
  }

  return (
    <Box>
      <Flex align="center">
        <Box style={{width: 24}}>
          {hasChildren ? (
            <Button fontSize={1} mode="bleed" onClick={handleToggle} text={expanded ? 'v' : '>'} />
          ) : null}
        </Box>

        <Button
          fontSize={1}
          mode={selected ? 'default' : 'bleed'}
          onClick={() => onSelect(node.path)}
          style={{justifyContent: 'flex-start', width: '100%'}}
          text={`${node.name} (${node.totalCount})`}
        />
      </Flex>

      {hasChildren && expanded && (
        <Box paddingLeft={3}>
          {node.children.map(childNode => (
            <FolderNode
              currentFolderPath={currentFolderPath}
              expandedPaths={expandedPaths}
              key={childNode.path}
              node={childNode}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

const FolderView = () => {
  const dispatch = useDispatch()
  const currentFolderPath = useTypedSelector(state => state.folders.currentFolderPath)
  const currentFolderUnfiled = useTypedSelector(state => state.folders.currentFolderUnfiled)
  const fetching = useTypedSelector(state => state.folders.fetching)
  const folderTree = useTypedSelector(selectFolderTree)
  const totalAssets = useTypedSelector(state => state.folders.assignedPaths.length)
  const unfiledCount = useTypedSelector(selectUnfiledCount)

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  useEffect(() => {
    setExpandedPaths(previous => {
      const next = new Set(previous)
      folderTree.forEach(node => next.add(node.path))

      if (currentFolderPath) {
        currentFolderPath.split('/').reduce((acc, segment) => {
          const nextPath = acc ? `${acc}/${segment}` : segment
          next.add(nextPath)
          return nextPath
        }, '')
      }

      return next
    })
  }, [currentFolderPath, folderTree])

  const hasFolders = folderTree.length > 0

  const handleFolderSelect = (folderPath: string) => {
    dispatch(foldersActions.currentFolderSet({folderPath}))
  }

  const handleFolderToggle = (folderPath: string) => {
    setExpandedPaths(previous => {
      const next = new Set(previous)
      if (next.has(folderPath)) {
        next.delete(folderPath)
      } else {
        next.add(folderPath)
      }
      return next
    })
  }

  const homeTone = useMemo(() => {
    return !currentFolderPath && !currentFolderUnfiled ? 'default' : 'bleed'
  }, [currentFolderPath, currentFolderUnfiled])

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
        <Flex align="center">
          <Box style={{width: 24}}>
            <Text muted size={1}>
              /
            </Text>
          </Box>
          <Button
            fontSize={1}
            mode={homeTone}
            onClick={() => dispatch(foldersActions.currentFolderClear())}
            style={{justifyContent: 'flex-start', width: '100%'}}
            text={`Home (${totalAssets})`}
          />
        </Flex>

        <Box paddingLeft={3}>
          {(unfiledCount > 0 || currentFolderUnfiled) && (
            <Button
              fontSize={1}
              mode={currentFolderUnfiled ? 'default' : 'bleed'}
              onClick={() => dispatch(foldersActions.currentFolderShowUnfiled())}
              style={{justifyContent: 'flex-start', width: '100%'}}
              text={`Unfiled (${unfiledCount})`}
            />
          )}

          {!hasFolders && !fetching && (
            <Box padding={3}>
              <Text muted size={1}>
                <em>No folders</em>
              </Text>
            </Box>
          )}

          {folderTree.map(node => (
            <FolderNode
              currentFolderPath={currentFolderPath}
              expandedPaths={expandedPaths}
              key={node.path}
              node={node}
              onSelect={handleFolderSelect}
              onToggle={handleFolderToggle}
            />
          ))}
        </Box>
      </Box>
    </Flex>
  )
}

export default FolderView
