import {FolderIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Stack, Text, Tree, TreeItem} from '@sanity/ui'
import {type ReactNode, useMemo, useState} from 'react'
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
  onSelect: (folderId: string | null) => void
  selectedId: string | null
}

const FolderNode = ({expandedIds, node, onSelect, selectedId}: FolderNodeProps) => {
  const hasChildren = node.children.length > 0
  const selected = selectedId === node.id

  return (
    <TreeItem
      expanded={expandedIds.has(node.id)}
      id={node.id}
      onClick={() => onSelect(node.id)}
      selected={selected}
      text={`${node.name} (${node.totalCount})`}
      weight={selected ? 'semibold' : 'medium'}
    >
      {hasChildren &&
        node.children.map(childNode => (
          <FolderNode
            expandedIds={expandedIds}
            key={childNode.id}
            node={childNode}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        ))}
    </TreeItem>
  )
}

type FolderTreeProps = {
  expandedIds: Set<string>
  folderTree: FolderTreeNode[]
  onSelect: (folderId: string | null) => void
  selectedId: string | null
}

const FolderTree = ({expandedIds, folderTree, onSelect, selectedId}: FolderTreeProps) => {
  const noFolderSelected = selectedId === null

  return (
    <Tree gap={1}>
      <TreeItem
        icon={FolderIcon}
        id="__no-folder"
        onClick={() => onSelect(null)}
        selected={noFolderSelected}
        text="No folder"
        weight={noFolderSelected ? 'semibold' : 'medium'}
      />

      {folderTree.map(node => (
        <FolderNode
          expandedIds={expandedIds}
          key={node.id}
          node={node}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ))}
    </Tree>
  )
}

const DialogFolderMove = ({children, dialog}: Props) => {
  const dispatch = useDispatch()
  const folderTree = useTypedSelector(selectFolderTree)
  const byId = useTypedSelector(state => state.folders.byId)
  const {assets, folderId, id} = dialog
  const [selectedId, setSelectedId] = useState<string | null>(folderId || null)
  const selectedFolder = selectedId ? byId[selectedId] : null
  const expandedIds = useMemo(() => getExpandedIdSet(folderId || null, byId), [byId, folderId])

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

  return (
    <Dialog
      animate
      footer={
        <Box padding={3}>
          <Flex justify="flex-end" gap={2}>
            <Button mode="ghost" onClick={handleClose} text="Cancel" />
            <Button
              mode="default"
              onClick={handleMove}
              text={selectedId ? `Move ${pluralize('asset', assets.length)}` : 'Remove from folder'}
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

        <Box style={{maxHeight: '22rem', overflowY: 'auto', paddingRight: '0.25rem'}}>
          <FolderTree
            expandedIds={expandedIds}
            folderTree={folderTree}
            onSelect={setSelectedId}
            selectedId={selectedId}
          />

          {folderTree.length === 0 && (
            <Box marginTop={3}>
              <Text muted size={1}>
                No folders yet. Create one first, or remove the assets from folders.
              </Text>
            </Box>
          )}
        </Box>

        <Inline space={2}>
          <Text muted size={1}>
            Destination:
          </Text>
          <Text size={1} weight="semibold">
            {selectedFolder?.name || 'No folder'}
          </Text>
        </Inline>
      </Stack>

      {children}
    </Dialog>
  )
}

export default DialogFolderMove
