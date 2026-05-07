import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  FolderIcon,
  TrashIcon
} from '@sanity/icons'
import {Box, Button, Card, Container, Flex, Inline, Label, Text, Tooltip} from '@sanity/ui'
import {type MouseEvent, type ReactNode, useEffect, useState} from 'react'
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
  onToggle: (folderId: string) => void
}

type FolderHeaderActionProps = {
  disabled?: boolean
  icon: ReactNode
  onClick: () => void
  tone?: 'critical' | 'primary'
  tooltip: string
}

const FolderHeaderAction = ({
  disabled,
  icon,
  onClick,
  tone,
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

const FolderNode = ({
  currentFolderId,
  expandedIds,
  node,
  onSelect,
  onToggle
}: FolderNodeProps) => {
  const expanded = expandedIds.has(node.id)
  const hasChildren = node.children.length > 0
  const selected = currentFolderId === node.id
  const selectedTextColor = selected ? '#fff' : 'inherit'
  const selectedSecondaryColor = selected ? 'rgba(255, 255, 255, 0.78)' : 'inherit'

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onToggle(node.id)
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
            onClick={() => onSelect(node.id)}
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
              currentFolderId={currentFolderId}
              expandedIds={expandedIds}
              key={childNode.id}
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
  const currentFolderId = useTypedSelector(state => state.folders.currentFolderId)
  const byId = useTypedSelector(state => state.folders.byId)
  const canDeleteFolder = useTypedSelector(selectCanDeleteFolder)
  const fetching = useTypedSelector(state => state.folders.fetching)
  const folderTree = useTypedSelector(selectFolderTree)
  const totalAssets = useTypedSelector(state => {
    return (
      state.folders.unfiledCount +
      Object.values(state.folders.exactCountByFolderId).reduce((sum, n) => sum + n, 0)
    )
  })
  const homeSelected = !currentFolderId
  const currentFolder = currentFolderId ? byId[currentFolderId] : null

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setExpandedIds(getExpandedIdSet(currentFolderId, byId))
  }, [currentFolderId, byId, folderTree])

  const hasFolders = folderTree.length > 0

  const handleFolderSelect = (folderId: string) => {
    dispatch(foldersActions.currentFolderSet({folderId}))
  }

  const handleFolderToggle = (folderId: string) => {
    setExpandedIds(previous => {
      const next = new Set(previous)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
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
              onClick={() =>
                dispatch(DIALOG_ACTIONS.showFolderRename({folderId: currentFolderId}))
              }
              tone="primary"
              tooltip="Rename folder"
            />
          )}

          <FolderHeaderAction
            icon={<AddIcon />}
            onClick={() =>
              dispatch(
                DIALOG_ACTIONS.showFolderCreate({parentFolderId: currentFolderId || null})
              )
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
              currentFolderId={currentFolderId}
              expandedIds={expandedIds}
              key={node.id}
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
