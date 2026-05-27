import {AddIcon, EditIcon, FolderIcon, TrashIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Container,
  Flex,
  Inline,
  Label,
  Text,
  Tooltip,
  Tree,
  TreeItem
} from '@sanity/ui'
import {type ReactNode, useMemo} from 'react'
import {useDispatch} from 'react-redux'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import type {FolderTreeNode} from '../../types'
import {dialogActions} from '../../modules/dialog'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'
import {foldersActions, selectCanDeleteFolder, selectFolderTree} from '../../modules/folders'

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

type FolderNodeProps = {
  currentFolderId: string | null
  expandedIds: Set<string>
  node: FolderTreeNode
  onSelect: (folderId: string) => void
}

type FolderHeaderActionProps = {
  disabled?: boolean
  icon: ReactNode
  onClick: () => void
  tone?: 'critical' | 'default' | 'primary'
  tooltip: string
}

const FolderHeaderAction = ({
  disabled = false,
  icon,
  onClick,
  tone = 'default',
  tooltip
}: FolderHeaderActionProps) => (
  <Tooltip
    animate
    content={
      <Container padding={2} width={0}>
        <Text muted size={1}>
          {tooltip}
        </Text>
      </Container>
    }
    disabled={'ontouchstart' in window}
    placement="top"
    portal
  >
    <Button
      aria-label={tooltip}
      disabled={disabled}
      fontSize={1}
      icon={icon}
      mode="bleed"
      onClick={onClick}
      padding={2}
      tone={tone}
    />
  </Tooltip>
)

type FolderItemTextProps = {
  name: string
  totalCount: number
}

/**
 * this uses some hacky css to get the desired layout
 * The tree item is a text container, so we need to use a span to wrap the content
 */
const FolderItemText = ({name, totalCount}: FolderItemTextProps) => (
  <span
    style={{
      boxSizing: 'border-box',
      display: 'block',
      maxWidth: '100%',
      minWidth: 0,
      overflow: 'hidden',
      paddingRight: '2rem',
      position: 'relative',
      width: '100%'
    }}
  >
    <span
      style={{
        alignItems: 'center',
        display: 'flex',
        paddingLeft: '0.25rem',
        gap: '0.5rem',
        minWidth: 0,
        overflow: 'hidden'
      }}
    >
      <span style={{display: 'inline-flex', flexShrink: 0, lineHeight: 0}}>
        <FolderIcon />
      </span>
      <span
        style={{
          display: 'block',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {name}
      </span>
    </span>
    <span
      style={{
        fontSize: '0.75rem',
        opacity: 0.78,
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    >
      {totalCount}
    </span>
  </span>
)

const FolderNode = ({currentFolderId, expandedIds, node, onSelect}: FolderNodeProps) => {
  const hasChildren = node.children.length > 0
  const selected = currentFolderId === node.id

  return (
    <TreeItem
      expanded={expandedIds.has(node.id)}
      id={node.id}
      onClick={() => onSelect(node.id)}
      selected={selected}
      text={<FolderItemText name={node.name} totalCount={node.totalCount} />}
      weight={selected ? 'semibold' : 'medium'}
    >
      {hasChildren &&
        node.children.map(childNode => (
          <FolderNode
            currentFolderId={currentFolderId}
            expandedIds={expandedIds}
            key={childNode.id}
            node={childNode}
            onSelect={onSelect}
          />
        ))}
    </TreeItem>
  )
}

const FolderView = () => {
  const dispatch = useDispatch()
  const currentFolderId = useTypedSelector(state => state.folders.currentFolderId)
  const byId = useTypedSelector(state => state.folders.byId)
  const canDeleteFolder = useTypedSelector(selectCanDeleteFolder)
  const fetching = useTypedSelector(state => state.folders.fetching)
  const folderTree = useTypedSelector(selectFolderTree)
  const currentFolder = currentFolderId ? byId[currentFolderId] : null
  const expandedIds = useMemo(
    () => getExpandedIdSet(currentFolderId, byId),
    [byId, currentFolderId]
  )
  const treeKey = useMemo(() => Array.from(expandedIds).join('|') || 'root', [expandedIds])

  const hasFolders = folderTree.length > 0

  const handleFolderSelect = (folderId: string) => {
    dispatch(foldersActions.currentFolderSet({folderId}))
  }

  const handleFolderDelete = () => {
    if (!currentFolderId || !currentFolder) {
      return
    }

    dispatch(
      dialogActions.showConfirmDeleteFolder({
        folderId: currentFolderId,
        folderName: currentFolder.name
      })
    )
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
        <Box flex={1}>
          <Inline space={2}>
            <Label size={0}>Folders</Label>
            {fetching && (
              <Label size={0} style={{opacity: 0.3}}>
                Loading...
              </Label>
            )}
          </Inline>
        </Box>

        <Inline space={1}>
          {currentFolderId && (
            <FolderHeaderAction
              icon={<EditIcon />}
              onClick={() => dispatch(DIALOG_ACTIONS.showFolderRename({folderId: currentFolderId}))}
              tone="primary"
              tooltip="Rename folder"
            />
          )}

          <FolderHeaderAction
            icon={<AddIcon />}
            onClick={() =>
              dispatch(DIALOG_ACTIONS.showFolderCreate({parentFolderId: currentFolderId || null}))
            }
            tone="primary"
            tooltip="Create folder"
          />

          {currentFolderId && canDeleteFolder && (
            <FolderHeaderAction
              icon={<TrashIcon />}
              onClick={handleFolderDelete}
              tone="critical"
              tooltip="Delete folder and contents"
            />
          )}
        </Inline>
      </Flex>

      <Box padding={2}>
        <Box>
          <Tree gap={1} key={treeKey}>
            <TreeItem
              id="__all-assets"
              onClick={() => dispatch(foldersActions.currentFolderClear())}
              selected={currentFolderId === null}
              text="All assets"
              weight={currentFolderId === null ? 'semibold' : 'medium'}
            />

            {folderTree.map(node => (
              <FolderNode
                currentFolderId={currentFolderId}
                expandedIds={expandedIds}
                key={node.id}
                node={node}
                onSelect={handleFolderSelect}
              />
            ))}
          </Tree>

          {!hasFolders && !fetching && (
            <Box marginTop={3} paddingX={1}>
              <Text muted size={1}>
                <em>No folders</em>
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  )
}

export default FolderView
