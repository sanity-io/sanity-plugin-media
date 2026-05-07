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

const getExpandedIdSet = (
  folderId: string | null,
  byId: Record<string, {parentId: string | null}>
) => {
  const expanded = new Set<string>()
  let cursor: string | null = folderId
  while (cursor && byId[cursor]) {
    expanded.add(cursor)
    cursor = byId[cursor].parentId
  }
  return expanded
}

type Props = {
  children: ReactNode
  dialog: DialogFolderMoveProps
}

type FolderNodeProps = {
  expandedIds: Set<string>
  node: FolderTreeNode
  onSelect: (folderId: string) => void
  onToggle: (folderId: string) => void
  selectedId: string | null
}

const FolderNode = ({expandedIds, node, onSelect, onToggle, selectedId}: FolderNodeProps) => {
  const expanded = expandedIds.has(node.id)
  const hasChildren = node.children.length > 0
  const selected = selectedId === node.id
  const selectedTextColor = selected ? '#fff' : 'inherit'
  const selectedSecondaryColor = selected ? 'rgba(255, 255, 255, 0.78)' : 'inherit'

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onToggle(node.id)
  }

  return (
    <Box marginTop={1}>
      <Card
        onClick={() => onSelect(node.id)}
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
              expandedIds={expandedIds}
              key={childNode.id}
              node={childNode}
              onSelect={onSelect}
              onToggle={onToggle}
              selectedId={selectedId}
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
  const byId = useTypedSelector(state => state.folders.byId)
  const {assets, folderId, id} = dialog
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(folderId || null)
  const selectedFolder = selectedId ? byId[selectedId] : null

  useEffect(() => {
    setExpandedIds(getExpandedIdSet(selectedId, byId))
  }, [folderTree, byId, selectedId])

  const handleClose = () => {
    dispatch(dialogActions.remove({id}))
  }

  const handleMove = () => {
    dispatch(
      assetsActions.folderSetRequest({
        assets,
        closeDialogId: id,
        folderId: selectedId
      })
    )
  }

  const handleToggle = (toggleId: string) => {
    setExpandedIds(previous => {
      const next = new Set(previous)
      if (next.has(toggleId)) {
        next.delete(toggleId)
      } else {
        next.add(toggleId)
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
              text={selectedId ? 'Move assets' : 'Move to Home'}
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
            onClick={() => setSelectedId(null)}
            padding={2}
            radius={2}
            style={{
              background: !selectedId ? 'var(--card-focus-ring-color)' : 'transparent',
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
                expandedIds={expandedIds}
                key={node.id}
                node={node}
                onSelect={setSelectedId}
                onToggle={handleToggle}
                selectedId={selectedId}
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
            {selectedFolder?.name || 'Home'}
          </Text>
        </Inline>
      </Stack>

      {children}
    </Dialog>
  )
}

export default DialogFolderMove
