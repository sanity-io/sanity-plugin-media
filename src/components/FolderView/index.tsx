import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  TrashIcon
} from '@sanity/icons'
import {Box, Button, Card, Flex, Inline, Label, Text} from '@sanity/ui'
import {type MouseEvent, useEffect, useMemo, useState} from 'react'
import {useDispatch} from 'react-redux'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import type {FolderTreeNode} from '../../types'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'
import {foldersActions, selectCanDeleteFolder, selectFolderTree} from '../../modules/folders'

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
          <Button
            aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
            disabled={!hasChildren}
            fontSize={1}
            icon={hasChildren ? (expanded ? ChevronDownIcon : ChevronRightIcon) : FolderIcon}
            mode="bleed"
            onClick={hasChildren ? handleToggle : undefined}
            style={{
              opacity: hasChildren ? 1 : 0.45
            }}
          />

          <Button
            fontSize={1}
            icon={FolderIcon}
            mode="bleed"
            onClick={() => onSelect(node.path)}
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              minWidth: 0,
              paddingLeft: '0.25rem'
            }}
          >
            <Text size={1} style={{minWidth: 0}} textOverflow="ellipsis" weight="semibold">
              {node.name}
            </Text>
            <Text muted size={0}>
              {node.totalCount}
            </Text>
          </Button>
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
    return !currentFolderPath ? 'default' : 'bleed'
  }, [currentFolderPath])

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
            background: homeTone === 'default' ? 'var(--card-focus-ring-color)' : 'transparent',
            border: '1px solid transparent'
          }}
        >
          <Button
            fontSize={1}
            icon={FolderIcon}
            mode="bleed"
            onClick={() => dispatch(foldersActions.currentFolderClear())}
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Text size={1} weight="semibold">
              Home
            </Text>
            <Text muted size={0}>
              {totalAssets}
            </Text>
          </Button>
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
