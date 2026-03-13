import {Box, Button, Card, Flex, Inline, Stack, Text} from '@sanity/ui'
import {type MouseEvent, type ReactNode, useEffect, useState} from 'react'
import {ChevronDownIcon, ChevronRightIcon, FolderIcon} from '@sanity/icons'
import pluralize from 'pluralize'
import {useDispatch} from 'react-redux'
import type {DialogFolderMoveProps, FolderTreeNode} from '../../types'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {selectFolderTree} from '../../modules/folders'
import Dialog from '../Dialog'

type Props = {
  children: ReactNode
  dialog: DialogFolderMoveProps
}

type FolderNodeProps = {
  expandedPaths: Set<string>
  node: FolderTreeNode
  onSelect: (folderPath: string) => void
  onToggle: (folderPath: string) => void
  selectedPath: string | null
}

const FolderNode = ({expandedPaths, node, onSelect, onToggle, selectedPath}: FolderNodeProps) => {
  const expanded = expandedPaths.has(node.path)
  const hasChildren = node.children.length > 0
  const selected = selectedPath === node.path

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onToggle(node.path)
  }

  return (
    <Box marginTop={1}>
      <Card
        onClick={() => onSelect(node.path)}
        padding={2}
        radius={2}
        style={{
          background: selected ? 'var(--card-focus-ring-color)' : 'transparent',
          border: '1px solid var(--card-border-color)',
          cursor: 'pointer'
        }}
      >
        <Flex align="center" gap={2}>
          <Button
            disabled={!hasChildren}
            fontSize={1}
            icon={hasChildren ? (expanded ? ChevronDownIcon : ChevronRightIcon) : FolderIcon}
            mode="bleed"
            onClick={hasChildren ? handleToggle : undefined}
            style={{opacity: hasChildren ? 1 : 0.45}}
          />

          <Text size={1} style={{flex: 1, minWidth: 0}} textOverflow="ellipsis" weight="semibold">
            {node.name}
          </Text>

          <Text muted size={0}>
            {node.totalCount}
          </Text>
        </Flex>
      </Card>

      {hasChildren && expanded && (
        <Box paddingLeft={4}>
          {node.children.map(childNode => (
            <FolderNode
              expandedPaths={expandedPaths}
              key={childNode.path}
              node={childNode}
              onSelect={onSelect}
              onToggle={onToggle}
              selectedPath={selectedPath}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

const DialogFolderMove = ({children, dialog}: Props) => {
  const dispatch = useDispatch()
  const folderTree = useTypedSelector(selectFolderTree)
  const {assets, folderPath, id} = dialog
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [selectedPath, setSelectedPath] = useState<string | null>(folderPath || null)

  useEffect(() => {
    setExpandedPaths(previous => {
      const next = new Set(previous)
      folderTree.forEach(node => next.add(node.path))

      if (selectedPath) {
        selectedPath.split('/').reduce((acc, segment) => {
          const nextPath = acc ? `${acc}/${segment}` : segment
          next.add(nextPath)
          return nextPath
        }, '')
      }

      return next
    })
  }, [folderTree, selectedPath])

  const handleClose = () => {
    dispatch(dialogActions.remove({id}))
  }

  const handleMove = () => {
    dispatch(
      assetsActions.folderSetRequest({
        assets,
        closeDialogId: id,
        folderPath: selectedPath
      })
    )
  }

  const handleToggle = (folderPathValue: string) => {
    setExpandedPaths(previous => {
      const next = new Set(previous)
      if (next.has(folderPathValue)) {
        next.delete(folderPathValue)
      } else {
        next.add(folderPathValue)
      }
      return next
    })
  }

  return (
    <Dialog
      animate
      footer={
        <Box padding={3}>
          <Flex justify="space-between">
            <Button mode="ghost" onClick={handleClose} text="Cancel" />
            <Button
              mode="default"
              onClick={handleMove}
              text={selectedPath ? 'Move assets' : 'Move to Home'}
              tone="primary"
            />
          </Flex>
        </Box>
      }
      header="Move to Folder"
      id={id}
      onClose={handleClose}
      width={1}
    >
      <Stack padding={4} space={4}>
        <Text size={1}>
          Move {assets.length} {pluralize('asset', assets.length)} to a folder.
        </Text>

        <Box>
          <Card
            onClick={() => setSelectedPath(null)}
            padding={2}
            radius={2}
            style={{
              background: !selectedPath ? 'var(--card-focus-ring-color)' : 'transparent',
              border: '1px solid var(--card-border-color)',
              cursor: 'pointer'
            }}
          >
            <Flex align="center" gap={2}>
              <FolderIcon />
              <Text size={1} weight="semibold">
                Home
              </Text>
              <Text muted size={0}>
                Root
              </Text>
            </Flex>
          </Card>

          <Box marginTop={2} style={{maxHeight: '22rem', overflowY: 'auto', paddingRight: '0.25rem'}}>
            {folderTree.map(node => (
              <FolderNode
                expandedPaths={expandedPaths}
                key={node.path}
                node={node}
                onSelect={setSelectedPath}
                onToggle={handleToggle}
                selectedPath={selectedPath}
              />
            ))}
          </Box>

          {folderTree.length === 0 && (
            <Box marginTop={3}>
              <Text muted size={1}>
                No folders yet. Create one first, or move the assets to Home.
              </Text>
            </Box>
          )}
        </Box>

        <Inline space={2}>
          <Text muted size={1}>
            Destination:
          </Text>
          <Text size={1} weight="semibold">
            {selectedPath || 'Home'}
          </Text>
        </Inline>
      </Stack>

      {children}
    </Dialog>
  )
}

export default DialogFolderMove
