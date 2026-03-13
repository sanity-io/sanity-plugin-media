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
  const selectedTextColor = selected ? '#fff' : 'inherit'
  const selectedSecondaryColor = selected ? 'rgba(255, 255, 255, 0.78)' : 'inherit'

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
          {hasChildren ? (
            <Button
              fontSize={1}
              icon={expanded ? ChevronDownIcon : ChevronRightIcon}
              mode="bleed"
              onClick={handleToggle}
              style={{color: selectedTextColor}}
            />
          ) : (
            <Box style={{width: '1.75rem'}} />
          )}

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
              <Box as="span" style={{display: 'inline-flex', lineHeight: 0}}>
                <FolderIcon />
              </Box>
              <Box as="span" style={{fontSize: '0.875rem', fontWeight: 600}}>
                Home
              </Box>
              <Box as="span" style={{color: 'var(--card-muted-fg-color)', fontSize: '0.75rem'}}>
                Root
              </Box>
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
