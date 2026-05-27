import {createSelector, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {ClientError} from '@sanity/client'
import groq from 'groq'
import {from, of} from 'rxjs'
import {
  catchError,
  debounceTime,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom
} from 'rxjs/operators'
import {nanoid} from 'nanoid'
import {FOLDER_DOCUMENT_NAME} from '../../constants'
import type {FolderDoc, FolderTreeItem, FolderTreeNode, HttpError, MyEpic} from '../../types'
import debugThrottle from '../../operators/debugThrottle'
import {assetsActions} from '../assets'
import type {RootReducerState} from '../types'
import {UPLOADS_ACTIONS} from '../uploads/actions'

type FoldersReducerState = {
  byId: Record<string, FolderDoc>
  childrenByParentId: Record<string, string[]>
  rootIds: string[]
  exactCountByFolderId: Record<string, number>
  unfiledCount: number
  currentFolderId: string | null
  currentFolderUnfiled: boolean
  panelVisible: boolean
  fetching: boolean
  fetchCount: number
  fetchingError?: HttpError
  creating: boolean
  creatingError?: HttpError
  deletingId?: string
  deleteError?: HttpError
  renaming: boolean
  renameError?: HttpError
  moving: boolean
  moveError?: HttpError
}

const ROOT_KEY = '__root__'

const initialState: FoldersReducerState = {
  byId: {},
  childrenByParentId: {},
  rootIds: [],
  exactCountByFolderId: {},
  unfiledCount: 0,
  currentFolderId: null,
  currentFolderUnfiled: false,
  panelVisible: false,
  fetching: false,
  fetchCount: -1,
  fetchingError: undefined,
  creating: false,
  creatingError: undefined,
  deletingId: undefined,
  deleteError: undefined,
  renaming: false,
  renameError: undefined,
  moving: false,
  moveError: undefined
}

const indexFolders = (folders: FolderDoc[]) => {
  const byId: Record<string, FolderDoc> = {}
  const childrenByParentId: Record<string, string[]> = {}
  const rootIds: string[] = []

  folders.forEach(folder => {
    byId[folder._id] = folder
  })

  // Resolve parent ids that reference unknown folders to null (defensive — orphan folders surface at root).
  folders.forEach(folder => {
    const parentKey = folder.parentId && byId[folder.parentId] ? folder.parentId : null
    if (parentKey === null) {
      rootIds.push(folder._id)
    } else {
      if (!childrenByParentId[parentKey]) {
        childrenByParentId[parentKey] = []
      }
      childrenByParentId[parentKey].push(folder._id)
    }
  })

  const sortByName = (ids: string[]) =>
    ids.sort((a, b) =>
      (byId[a]?.name || '').localeCompare(byId[b]?.name || '', undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    )

  sortByName(rootIds)
  Object.keys(childrenByParentId).forEach(parentId => sortByName(childrenByParentId[parentId]))

  return {byId, childrenByParentId, rootIds}
}

const collectDescendantIds = (
  folderId: string,
  childrenByParentId: Record<string, string[]>
): string[] => {
  const stack = [...(childrenByParentId[folderId] || [])]
  const out: string[] = []
  while (stack.length) {
    const id = stack.pop()!
    out.push(id)
    const children = childrenByParentId[id]
    if (children) {
      stack.push(...children)
    }
  }
  return out
}

const isDescendant = (
  ancestorId: string,
  candidateId: string,
  byId: Record<string, FolderDoc>
): boolean => {
  let cursor: string | null = candidateId
  const seen = new Set<string>()
  while (cursor) {
    if (seen.has(cursor)) return false
    seen.add(cursor)
    if (cursor === ancestorId) return true
    cursor = byId[cursor]?.parentId ?? null
  }
  return false
}

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    createComplete(state, _action: PayloadAction<{folder: FolderDoc}>) {
      state.creating = false
    },
    createError(state, action: PayloadAction<{error: HttpError}>) {
      state.creating = false
      state.creatingError = action.payload.error
    },
    createRequest(state, _action: PayloadAction<{name: string; parentId?: string | null}>) {
      state.creating = true
      delete state.creatingError
    },
    currentFolderClear(state) {
      state.currentFolderId = null
      state.currentFolderUnfiled = false
    },
    currentFolderSet(state, action: PayloadAction<{folderId: string}>) {
      state.currentFolderId = action.payload.folderId
      state.currentFolderUnfiled = false
    },
    currentFolderShowUnfiled(state) {
      state.currentFolderId = null
      state.currentFolderUnfiled = true
    },
    deleteComplete(state, action: PayloadAction<{folderId: string; deletedIds: string[]}>) {
      state.deletingId = undefined
      const removed = new Set(action.payload.deletedIds)
      if (state.currentFolderId && removed.has(state.currentFolderId)) {
        state.currentFolderId = null
      }
    },
    deleteError(state, action: PayloadAction<{error: HttpError; folderId: string}>) {
      state.deletingId = undefined
      state.deleteError = action.payload.error
    },
    deleteRequest(state, action: PayloadAction<{folderId: string}>) {
      state.deletingId = action.payload.folderId
      delete state.deleteError
    },
    fetchComplete(
      state,
      action: PayloadAction<{
        folders: FolderDoc[]
        exactCountByFolderId: Record<string, number>
        unfiledCount: number
      }>
    ) {
      const {byId, childrenByParentId, rootIds} = indexFolders(action.payload.folders)
      state.byId = byId
      state.childrenByParentId = childrenByParentId
      state.rootIds = rootIds
      state.exactCountByFolderId = action.payload.exactCountByFolderId
      state.unfiledCount = action.payload.unfiledCount
      state.fetching = false
      state.fetchCount = action.payload.folders.length
      delete state.fetchingError

      if (state.currentFolderId && !byId[state.currentFolderId]) {
        state.currentFolderId = null
      }
    },
    fetchError(state, action: PayloadAction<{error: HttpError}>) {
      state.fetching = false
      state.fetchingError = action.payload.error
    },
    fetchRequest(state) {
      state.fetching = true
      delete state.fetchingError
    },
    moveComplete(state, _action: PayloadAction<{folderId: string; parentId: string | null}>) {
      state.moving = false
    },
    moveError(state, action: PayloadAction<{error: HttpError; folderId: string}>) {
      state.moving = false
      state.moveError = action.payload.error
    },
    moveRequest(state, _action: PayloadAction<{folderId: string; parentId: string | null}>) {
      state.moving = true
      delete state.moveError
    },
    panelVisibleSet(state, action: PayloadAction<{panelVisible: boolean}>) {
      state.panelVisible = action.payload.panelVisible
    },
    renameComplete(state, _action: PayloadAction<{folderId: string; name: string}>) {
      state.renaming = false
    },
    renameError(state, action: PayloadAction<{error: HttpError}>) {
      state.renaming = false
      state.renameError = action.payload.error
    },
    renameRequest(state, _action: PayloadAction<{folderId: string; name: string}>) {
      state.renaming = true
      delete state.renameError
    }
  }
})

export const foldersFetchEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(foldersSlice.actions.fetchRequest.match),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => {
          const assetTypes = state.assets.assetTypes.map(type => `sanity.${type}Asset`)
          return client.observable.fetch<{
            folders: {_id: string; name?: string; parentId?: string | null}[]
            assetCounts: {folderId: string; count: number}[]
            unfiledCount: number
          }>(
            groq`{
              "folders": *[
                _type == "${FOLDER_DOCUMENT_NAME}"
                && !(_id in path("drafts.**"))
              ] {
                _id,
                name,
                "parentId": parent._ref
              },
              "assetCounts": *[
                _type in ${JSON.stringify(assetTypes)}
                && !(_id in path("drafts.**"))
                && defined(opt.media.folder._ref)
              ] {
                "folderId": opt.media.folder._ref
              } | {
                "folderId": folderId,
                "count": count(*[_id == ^.folderId])
              },
              "unfiledCount": count(*[
                _type in ${JSON.stringify(assetTypes)}
                && !(_id in path("drafts.**"))
                && !defined(opt.media.folder._ref)
              ])
            }`
          )
        }),
        mergeMap(result => {
          const folders: FolderDoc[] = result.folders.map(f => ({
            _id: f._id,
            name: f.name || '',
            parentId: f.parentId || null
          }))
          const exactCountByFolderId: Record<string, number> = {}
          result.assetCounts.forEach(({folderId, count}) => {
            exactCountByFolderId[folderId] = (exactCountByFolderId[folderId] || 0) + count
          })
          return of(
            foldersSlice.actions.fetchComplete({
              folders,
              exactCountByFolderId,
              unfiledCount: result.unfiledCount
            })
          )
        }),
        catchError((error: ClientError) =>
          of(
            foldersSlice.actions.fetchError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              }
            })
          )
        )
      )
    )
  )

export const foldersRefreshEpic: MyEpic = action$ =>
  action$.pipe(
    filter(
      action =>
        assetsActions.deleteComplete.match(action) ||
        assetsActions.folderSetComplete.match(action) ||
        foldersSlice.actions.createComplete.match(action) ||
        foldersSlice.actions.deleteComplete.match(action) ||
        foldersSlice.actions.moveComplete.match(action) ||
        foldersSlice.actions.renameComplete.match(action) ||
        assetsActions.listenerCreateQueueComplete.match(action) ||
        assetsActions.listenerDeleteQueueComplete.match(action) ||
        assetsActions.listenerUpdateQueueComplete.match(action) ||
        assetsActions.updateComplete.match(action) ||
        UPLOADS_ACTIONS.uploadComplete.match(action)
    ),
    debounceTime(300),
    mergeMap(() => of(foldersSlice.actions.fetchRequest()))
  )

export const foldersCurrentFolderEpic: MyEpic = action$ =>
  action$.pipe(
    filter(
      action =>
        foldersSlice.actions.currentFolderClear.match(action) ||
        foldersSlice.actions.currentFolderSet.match(action) ||
        foldersSlice.actions.currentFolderShowUnfiled.match(action)
    ),
    mergeMap(() =>
      of(
        assetsActions.clear(),
        assetsActions.pickClear(),
        assetsActions.loadPageIndex({pageIndex: 0})
      )
    )
  )

export const foldersCreateEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(foldersSlice.actions.createRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const name = action.payload.name.trim()
      const parentId = action.payload.parentId || null

      if (!name) {
        return of(
          foldersSlice.actions.createError({
            error: {message: 'Folder name cannot be empty', statusCode: 400}
          })
        )
      }

      const siblingIds = parentId
        ? state.folders.childrenByParentId[parentId] || []
        : state.folders.rootIds
      const collision = siblingIds.some(
        id => state.folders.byId[id]?.name.toLowerCase() === name.toLowerCase()
      )
      if (collision) {
        return of(
          foldersSlice.actions.createError({
            error: {message: 'A folder with this name already exists here', statusCode: 409}
          })
        )
      }

      const newId = `${FOLDER_DOCUMENT_NAME}.${nanoid()}`
      const doc: {
        _id: string
        _type: string
        name: string
        parent?: {_ref: string; _type: 'reference'; _weak: true}
      } = {
        _id: newId,
        _type: FOLDER_DOCUMENT_NAME,
        name
      }
      if (parentId) {
        doc.parent = {_ref: parentId, _type: 'reference', _weak: true}
      }

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => client.observable.create(doc)),
        mergeMap(() =>
          of(
            foldersSlice.actions.createComplete({folder: {_id: newId, name, parentId}}),
            foldersSlice.actions.currentFolderSet({folderId: newId})
          )
        ),
        catchError((error: ClientError) =>
          of(
            foldersSlice.actions.createError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              }
            })
          )
        )
      )
    })
  )

export const foldersDeleteEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(foldersSlice.actions.deleteRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const folderId = action.payload.folderId
      const descendantIds = collectDescendantIds(folderId, state.folders.childrenByParentId)
      const folderIds = [folderId, ...descendantIds]

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          client.observable.fetch<{assets: {_id: string}[]}>(
            groq`{
              "assets": *[
                _type in ${JSON.stringify(
                  state.assets.assetTypes.map(type => `sanity.${type}Asset`)
                )}
                && !(_id in path("drafts.**"))
                && opt.media.folder._ref in $folderIds
              ] {
                _id
              }
            }`,
            {folderIds}
          )
        ),
        mergeMap(result => {
          const tx = client.transaction()
          // Unset folder ref on referencing assets first (weak refs are forgiving but we still
          // delete the assets here to match v1 recursive-delete semantics — assets in a folder
          // are removed with the folder).
          result.assets.forEach(asset => tx.delete(asset._id))
          folderIds.forEach(id => tx.delete(id))

          return from(tx.commit()).pipe(
            map(() =>
              foldersSlice.actions.deleteComplete({
                folderId,
                deletedIds: folderIds
              })
            )
          )
        }),
        catchError((error: ClientError) =>
          of(
            foldersSlice.actions.deleteError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              folderId
            })
          )
        )
      )
    })
  )

export const foldersRenameEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(foldersSlice.actions.renameRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {folderId} = action.payload
      const name = action.payload.name.trim()
      const folder = state.folders.byId[folderId]

      if (!folder) {
        return of(
          foldersSlice.actions.renameError({
            error: {message: 'Folder not found', statusCode: 404}
          })
        )
      }

      if (!name) {
        return of(
          foldersSlice.actions.renameError({
            error: {message: 'Folder name cannot be empty', statusCode: 400}
          })
        )
      }

      if (name === folder.name) {
        return of(
          foldersSlice.actions.renameError({
            error: {message: 'Folder name has not changed', statusCode: 400}
          })
        )
      }

      const siblingIds = folder.parentId
        ? state.folders.childrenByParentId[folder.parentId] || []
        : state.folders.rootIds
      const collision = siblingIds.some(
        id => id !== folderId && state.folders.byId[id]?.name.toLowerCase() === name.toLowerCase()
      )
      if (collision) {
        return of(
          foldersSlice.actions.renameError({
            error: {message: 'A folder with this name already exists here', statusCode: 409}
          })
        )
      }

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => client.observable.patch(folderId).set({name}).commit()),
        mergeMap(() => of(foldersSlice.actions.renameComplete({folderId, name}))),
        catchError((error: ClientError) =>
          of(
            foldersSlice.actions.renameError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              }
            })
          )
        )
      )
    })
  )

export const foldersMoveEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(foldersSlice.actions.moveRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {folderId} = action.payload
      const parentId = action.payload.parentId || null
      const folder = state.folders.byId[folderId]

      if (!folder) {
        return of(
          foldersSlice.actions.moveError({
            error: {message: 'Folder not found', statusCode: 404},
            folderId
          })
        )
      }

      if (parentId === folder.parentId) {
        return of(
          foldersSlice.actions.moveError({
            error: {message: 'Folder is already in this location', statusCode: 400},
            folderId
          })
        )
      }

      if (
        parentId === folderId ||
        (parentId && isDescendant(folderId, parentId, state.folders.byId))
      ) {
        return of(
          foldersSlice.actions.moveError({
            error: {
              message: 'Cannot move a folder into itself or its descendants',
              statusCode: 400
            },
            folderId
          })
        )
      }

      const siblingIds = parentId
        ? state.folders.childrenByParentId[parentId] || []
        : state.folders.rootIds
      const collision = siblingIds.some(
        id =>
          id !== folderId &&
          state.folders.byId[id]?.name.toLowerCase() === folder.name.toLowerCase()
      )
      if (collision) {
        return of(
          foldersSlice.actions.moveError({
            error: {message: 'A folder with this name already exists here', statusCode: 409},
            folderId
          })
        )
      }

      const patch = client.observable.patch(folderId)
      const committed = parentId
        ? patch.set({parent: {_ref: parentId, _type: 'reference', _weak: true}}).commit()
        : patch.unset(['parent']).commit()

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => committed),
        mergeMap(() => of(foldersSlice.actions.moveComplete({folderId, parentId}))),
        catchError((error: ClientError) =>
          of(
            foldersSlice.actions.moveError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              folderId
            })
          )
        )
      )
    })
  )

const selectById = (state: RootReducerState) => state.folders.byId
const selectChildrenByParentId = (state: RootReducerState) => state.folders.childrenByParentId
const selectRootIds = (state: RootReducerState) => state.folders.rootIds
const selectExactCountByFolderId = (state: RootReducerState) => state.folders.exactCountByFolderId
const selectCurrentFolderId = (state: RootReducerState) => state.folders.currentFolderId
const selectCurrentFolderUnfiled = (state: RootReducerState) => state.folders.currentFolderUnfiled

const buildFolderPath = (folderId: string, byId: Record<string, FolderDoc>): string => {
  const segments: string[] = []
  let cursor: string | null = folderId
  const seen = new Set<string>()
  while (cursor && byId[cursor] && !seen.has(cursor)) {
    seen.add(cursor)
    segments.unshift(byId[cursor].name)
    cursor = byId[cursor].parentId
  }
  return segments.join('/')
}

export const selectFolderPathById = createSelector(
  [selectById, (_state: RootReducerState, folderId: string | null | undefined) => folderId],
  (byId, folderId) => (folderId ? buildFolderPath(folderId, byId) : '')
)

export const selectFolderTree = createSelector(
  [selectById, selectChildrenByParentId, selectRootIds, selectExactCountByFolderId],
  (byId, childrenByParentId, rootIds, exactCountByFolderId): FolderTreeNode[] => {
    const buildNode = (folderId: string): FolderTreeNode => {
      const folder = byId[folderId]
      const children = (childrenByParentId[folderId] || []).map(buildNode)
      const exactCount = exactCountByFolderId[folderId] || 0
      const totalCount = children.reduce((sum, child) => sum + child.totalCount, exactCount)
      return {
        children,
        exactCount,
        id: folderId,
        name: folder?.name || '',
        parentId: folder?.parentId ?? null,
        path: buildFolderPath(folderId, byId),
        totalCount
      }
    }

    return rootIds.map(buildNode)
  }
)

export const selectCurrentFolderSegments = createSelector(
  [selectById, selectCurrentFolderId],
  (byId, currentFolderId): FolderTreeItem[] => {
    if (!currentFolderId) return []
    const chain: string[] = []
    let cursor: string | null = currentFolderId
    const seen = new Set<string>()
    while (cursor && byId[cursor] && !seen.has(cursor)) {
      seen.add(cursor)
      chain.unshift(cursor)
      cursor = byId[cursor].parentId
    }
    return chain.map((id, depth) => ({
      depth,
      exactCount: 0,
      id,
      name: byId[id]?.name || '',
      parentId: byId[id]?.parentId ?? null,
      path: buildFolderPath(id, byId),
      totalCount: 0
    }))
  }
)

export const selectUnfiledCount = (state: RootReducerState) => state.folders.unfiledCount

type FoldersIndex = {
  byId: Record<string, FolderDoc>
  childrenByParentId: Record<string, string[]>
  rootIds: string[]
  exactCountByFolderId: Record<string, number>
}

const selectFoldersIndex = createSelector(
  [selectById, selectChildrenByParentId, selectRootIds, selectExactCountByFolderId],
  (byId, childrenByParentId, rootIds, exactCountByFolderId): FoldersIndex => ({
    byId,
    childrenByParentId,
    rootIds,
    exactCountByFolderId
  })
)

export const selectCurrentFolderChildren = createSelector(
  [selectFoldersIndex, selectCurrentFolderId, selectCurrentFolderUnfiled],
  (
    {byId, childrenByParentId, rootIds, exactCountByFolderId},
    currentFolderId,
    currentFolderUnfiled
  ): FolderTreeItem[] => {
    if (currentFolderUnfiled || !currentFolderId) return []
    const ids = currentFolderId ? childrenByParentId[currentFolderId] || [] : rootIds
    const depth = currentFolderId ? buildFolderPath(currentFolderId, byId).split('/').length : 0
    return ids.map(id => {
      const folder = byId[id]
      // Sum totalCount over the subtree.
      const stack = [id]
      let totalCount = 0
      while (stack.length) {
        const cur = stack.pop()!
        totalCount += exactCountByFolderId[cur] || 0
        const kids = childrenByParentId[cur]
        if (kids) stack.push(...kids)
      }
      return {
        depth,
        exactCount: exactCountByFolderId[id] || 0,
        id,
        name: folder?.name || '',
        parentId: folder?.parentId ?? null,
        path: buildFolderPath(id, byId),
        totalCount
      }
    })
  }
)

export const selectCanDeleteFolder = createSelector(
  [selectCurrentFolderId],
  currentFolderId => !!currentFolderId
)

export {ROOT_KEY}

export const foldersActions = {...foldersSlice.actions}

export default foldersSlice.reducer
