import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  FolderIcon,
  TrashIcon
} from '@sanity/icons'
import {Box, Button, Card, Flex, Inline, Label, Text} from '@sanity/ui'
import {type MouseEvent, useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import type {FolderTreeNode} from '../../types'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'
import {foldersActions, selectCanDeleteFolder, selectFolderTree} from '../../modules/folders'

const getExpandedPathSet = (folderPath: string | null) => {
  if (!folderPath) {
    return new Set<string>()
  }

  const expandedPaths = new Set<string>()

  folderPath.split('/').reduce((previousPath, segment) => {
    const nextPath = previousPath ? `${previousPath}/${segment}` : segment
    expandedPaths.add(nextPath)
    return nextPath
  }, '')

  return expandedPaths
}

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
  const selectedTextColor = selected ? '#fff' : 'inherit'
  const selectedSecondaryColor = selected ? 'rgba(255, 255, 255, 0.78)' : 'inherit'

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onToggle(node.path)
  }

  return (
    <Box marginTop={1}>
      <Card
        padding={1}
        radius={2}
        style={{
          background: selected ? 'var(--card-focus-ring-color)' : 'transparent',
          border: '1px solid transparent'
        }}
      >
        <Flex align="center" gap={1}>
          {hasChildren ? (
            <Button
              aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
              fontSize={1}
              icon={expanded ? ChevronDownIcon : ChevronRightIcon}
              mode="bleed"
              onClick={handleToggle}
              style={{color: selectedTextColor}}
            />
          ) : (
            <Box style={{width: '1.75rem'}} />
          )}

          <button
            onClick={() => onSelect(node.path)}
            style={{
              alignItems: 'center',
              appearance: 'none',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              display: 'flex',
              flex: 1,
              gap: '0.5rem',
              justifyContent: 'space-between',
              minWidth: 0,
              padding: '0.25rem 0.5rem 0.25rem 0.25rem',
              color: selectedTextColor,
              textAlign: 'left'
            }}
            type="button"
          >
            <Box
              as="span"
              style={{
                color: selectedSecondaryColor,
                display: 'inline-flex',
                lineHeight: 0
              }}
            >
              <FolderIcon />
            </Box>
            <Box
              as="span"
              style={{
                color: selectedTextColor,
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {node.name}
            </Box>
            <Box
              as="span"
              style={{
                color: selectedSecondaryColor,
                fontSize: '0.75rem'
              }}
            >
              {node.totalCount}
            </Box>
          </button>
        </Flex>
      </Card>

      {hasChildren && expanded && (
        <Box paddingLeft={4}>
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
  const canDeleteFolder = useTypedSelector(selectCanDeleteFolder)
  const fetching = useTypedSelector(state => state.folders.fetching)
  const folderTree = useTypedSelector(selectFolderTree)
  const totalAssets = useTypedSelector(state => state.folders.assignedPaths.length)
  const homeSelected = !currentFolderPath

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  useEffect(() => {
    setExpandedPaths(getExpandedPathSet(currentFolderPath))
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

  return (
    <Flex direction="column" flex={1} height="fill">
      <Flex
        align="center"
        justify="space-between"
        paddingX={3}
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

        <Inline space={1}>
          {currentFolderPath && (
            <Button
              fontSize={1}
              icon={EditIcon}
              mode="bleed"
              onClick={() => dispatch(DIALOG_ACTIONS.showFolderRename({folderPath: currentFolderPath}))}
              text="Rename"
            />
          )}

          <Button
            fontSize={1}
            icon={AddIcon}
            mode="bleed"
            onClick={() =>
              dispatch(DIALOG_ACTIONS.showFolderCreate({folderPath: currentFolderPath || null}))
            }
            text="New"
          />

          {currentFolderPath && canDeleteFolder && (
            <Button
              fontSize={1}
              icon={TrashIcon}
              mode="bleed"
              onClick={() => dispatch(foldersActions.deleteRequest({path: currentFolderPath}))}
              text="Delete"
              tone="critical"
            />
          )}
        </Inline>
      </Flex>

      <Box padding={2}>
        <Card
          padding={1}
          radius={2}
          style={{
            background: homeSelected ? 'var(--card-focus-ring-color)' : 'transparent',
            border: '1px solid transparent'
          }}
        >
          <button
            onClick={() => dispatch(foldersActions.currentFolderClear())}
            style={{
              alignItems: 'center',
              appearance: 'none',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'space-between',
              padding: '0.5rem',
              color: homeSelected ? '#fff' : 'inherit',
              width: '100%'
            }}
            type="button"
          >
            <Box
              as="span"
              style={{
                color: homeSelected ? 'rgba(255, 255, 255, 0.78)' : 'inherit',
                display: 'inline-flex',
                lineHeight: 0
              }}
            >
              <FolderIcon />
            </Box>
            <Box
              as="span"
              style={{
                color: homeSelected ? '#fff' : 'inherit',
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                minWidth: 0
              }}
            >
              Home
            </Box>
            <Box
              as="span"
              style={{
                color: homeSelected ? 'rgba(255, 255, 255, 0.78)' : 'inherit',
                fontSize: '0.75rem'
              }}
            >
              {totalAssets}
            </Box>
          </button>
        </Card>

        <Box marginTop={2} paddingLeft={3}>
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
