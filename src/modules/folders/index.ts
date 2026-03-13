import {createSelector, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {ClientError, Patch, Transaction} from '@sanity/client'
import groq from 'groq'
import {of} from 'rxjs'
import {catchError, debounceTime, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import {nanoid} from 'nanoid'
import {FOLDER_DOCUMENT_NAME} from '../../constants'
import normalizeFolderPath from '../../utils/normalizeFolderPath'
import type {FolderTreeItem, FolderTreeNode, HttpError, MyEpic} from '../../types'
import debugThrottle from '../../operators/debugThrottle'
import {assetsActions} from '../assets'
import type {RootReducerState} from '../types'
import {UPLOADS_ACTIONS} from '../uploads/actions'

type FoldersReducerState = {
  assignedPaths: (string | null)[]
  creating: boolean
  creatingError?: HttpError
  currentFolderPath: string | null
  currentFolderUnfiled: boolean
  deletingPath?: string
  fetchCount: number
  fetching: boolean
  fetchingError?: HttpError
  panelVisible: boolean
  persistedPaths: string[]
  renameError?: HttpError
  renaming: boolean
}

const initialState: FoldersReducerState = {
  assignedPaths: [],
  creating: false,
  creatingError: undefined,
  currentFolderPath: null,
  currentFolderUnfiled: false,
  deletingPath: undefined,
  fetchCount: -1,
  fetching: false,
  fetchingError: undefined,
  panelVisible: true,
  persistedPaths: [],
  renameError: undefined,
  renaming: false
}

const getAvailableFolderPaths = (folderPaths: (string | null)[]) => {
  const availablePaths = new Set<string>()

  folderPaths.forEach(path => {
    const normalizedPath = normalizeFolderPath(path)
    if (!normalizedPath) {
      return
    }

    normalizedPath.split('/').reduce((acc, segment) => {
      const nextPath = acc ? `${acc}/${segment}` : segment
      availablePaths.add(nextPath)
      return nextPath
    }, '')
  })

  return availablePaths
}

const replaceFolderPrefix = ({
  nextPath,
  path,
  previousPath
}: {
  nextPath: string
  path: string | null
  previousPath: string
}) => {
  const normalizedPath = normalizeFolderPath(path)
  const normalizedPreviousPath = normalizeFolderPath(previousPath)
  const normalizedNextPath = normalizeFolderPath(nextPath)

  if (!normalizedPath) {
    return path
  }

  if (normalizedPath === normalizedPreviousPath) {
    return normalizedNextPath
  }

  if (normalizedPath.startsWith(`${normalizedPreviousPath}/`)) {
    return `${normalizedNextPath}${normalizedPath.slice(normalizedPreviousPath.length)}`
  }

  return normalizedPath
}

const patchOperationAssetFolderSet =
  ({folderPath}: {folderPath: string}) =>
  (patch: Patch) =>
    patch
      .setIfMissing({opt: {}})
      .setIfMissing({'opt.media': {}})
      .set({'opt.media.folder': folderPath})

const patchOperationFolderPathSet =
  ({path}: {path: string}) =>
  (patch: Patch) =>
    patch.set({path})

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    createComplete(state, action: PayloadAction<{path: string}>) {
      state.creating = false
      if (!state.persistedPaths.includes(action.payload.path)) {
        state.persistedPaths.push(action.payload.path)
      }
    },
    createError(state, action: PayloadAction<{error: HttpError}>) {
      state.creating = false
      state.creatingError = action.payload.error
    },
    createRequest(state, _action: PayloadAction<{name: string; parentPath?: string | null}>) {
      state.creating = true
      delete state.creatingError
    },
    currentFolderClear(state) {
      state.currentFolderPath = null
      state.currentFolderUnfiled = false
    },
    currentFolderSet(state, action: PayloadAction<{folderPath: string}>) {
      state.currentFolderPath = normalizeFolderPath(action.payload.folderPath)
      state.currentFolderUnfiled = false
    },
    currentFolderShowUnfiled(state) {
      state.currentFolderPath = null
      state.currentFolderUnfiled = true
    },
    deleteComplete(state, action: PayloadAction<{path: string}>) {
      state.deletingPath = undefined
      state.persistedPaths = state.persistedPaths.filter(path => path !== action.payload.path)
      if (state.currentFolderPath === action.payload.path) {
        state.currentFolderPath = null
      }
    },
    deleteError(state, _action: PayloadAction<{error: HttpError; path: string}>) {
      state.deletingPath = undefined
    },
    deleteRequest(state, action: PayloadAction<{path: string}>) {
      state.deletingPath = action.payload.path
    },
    fetchComplete(
      state,
      action: PayloadAction<{assignedPaths: (string | null)[]; persistedPaths: string[]}>
    ) {
      const assignedPaths = action.payload.assignedPaths.map(path => {
        const normalizedPath = normalizeFolderPath(path)
        return normalizedPath || null
      })
      const persistedPaths = action.payload.persistedPaths
        .map(path => normalizeFolderPath(path))
        .filter(Boolean)

      state.assignedPaths = assignedPaths
      state.persistedPaths = persistedPaths
      state.fetching = false
      state.fetchCount = assignedPaths.length + persistedPaths.length
      delete state.fetchingError

      const availableFolderPaths = getAvailableFolderPaths([
        ...assignedPaths,
        ...state.persistedPaths
      ])
      if (state.currentFolderPath && !availableFolderPaths.has(state.currentFolderPath)) {
        state.currentFolderPath = null
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
    panelVisibleSet(state, action: PayloadAction<{panelVisible: boolean}>) {
      state.panelVisible = action.payload.panelVisible
    },
    renameComplete(state, action: PayloadAction<{nextPath: string; previousPath: string}>) {
      state.renaming = false
      state.assignedPaths = state.assignedPaths.map(
        path =>
          replaceFolderPrefix({
            nextPath: action.payload.nextPath,
            path,
            previousPath: action.payload.previousPath
          }) || null
      )
      state.persistedPaths = state.persistedPaths.map(
        path =>
          replaceFolderPrefix({
            nextPath: action.payload.nextPath,
            path,
            previousPath: action.payload.previousPath
          }) || path
      )

      if (state.currentFolderPath) {
        state.currentFolderPath =
          replaceFolderPrefix({
            nextPath: action.payload.nextPath,
            path: state.currentFolderPath,
            previousPath: action.payload.previousPath
          }) || null
      }
    },
    renameError(state, action: PayloadAction<{error: HttpError}>) {
      state.renaming = false
      state.renameError = action.payload.error
    },
    renameRequest(state, _action: PayloadAction<{name: string; path: string}>) {
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
        mergeMap(() =>
          client.observable.fetch<{assets: {folder: string | null}[]; folders: {path: string}[]}>(
            groq`{
              "assets": *[
                _type in ${JSON.stringify(
                  state.assets.assetTypes.map(type => `sanity.${type}Asset`)
                )}
                && !(_id in path("drafts.**"))
              ] {
                "folder": opt.media.folder
              },
              "folders": *[
                _type == "${FOLDER_DOCUMENT_NAME}"
                && !(_id in path("drafts.**"))
              ] {
                path
              }
            }`
          )
        ),
        mergeMap(result =>
          of(
            foldersSlice.actions.fetchComplete({
              assignedPaths: result.assets.map(item => item.folder || null),
              persistedPaths: result.folders.map(item => item.path)
            })
          )
        ),
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
        foldersSlice.actions.currentFolderShowUnfiled.match(action) ||
        foldersSlice.actions.renameComplete.match(action)
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
      const parentPath = normalizeFolderPath(action.payload.parentPath)
      const folderName = normalizeFolderPath(action.payload.name)
      const path = parentPath ? `${parentPath}/${folderName}` : folderName
      const existingPaths = getAvailableFolderPaths([
        ...state.folders.assignedPaths,
        ...state.folders.persistedPaths
      ])

      if (!folderName) {
        return of(
          foldersSlice.actions.createError({
            error: {message: 'Folder name cannot be empty', statusCode: 400}
          })
        )
      }

      if (existingPaths.has(path)) {
        return of(
          foldersSlice.actions.createError({
            error: {message: 'A folder with this path already exists', statusCode: 409}
          })
        )
      }

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          client.observable.create({
            _id: `${FOLDER_DOCUMENT_NAME}.${nanoid()}`,
            _type: FOLDER_DOCUMENT_NAME,
            path
          })
        ),
        mergeMap(() =>
          of(
            foldersSlice.actions.createComplete({path}),
            foldersSlice.actions.currentFolderSet({folderPath: path})
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
      const path = action.payload.path
      const normalizedPath = normalizeFolderPath(path)
      const hasAssignedDescendants = state.folders.assignedPaths.some(folderPath => {
        const nextPath = normalizeFolderPath(folderPath)
        return nextPath === normalizedPath || nextPath.startsWith(`${normalizedPath}/`)
      })
      const hasPersistedDescendants = state.folders.persistedPaths.some(folderPath => {
        const nextPath = normalizeFolderPath(folderPath)
        return nextPath !== normalizedPath && nextPath.startsWith(`${normalizedPath}/`)
      })

      if (hasAssignedDescendants || hasPersistedDescendants) {
        return of(
          foldersSlice.actions.deleteError({
            error: {
              message: 'Only empty folders can be deleted',
              statusCode: 400
            },
            path: normalizedPath
          })
        )
      }

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          client.observable.delete({
            query: groq`*[_type == "${FOLDER_DOCUMENT_NAME}" && path == $path]`,
            params: {path: normalizedPath}
          })
        ),
        mergeMap(() => of(foldersSlice.actions.deleteComplete({path: normalizedPath}))),
        catchError((error: ClientError) =>
          of(
            foldersSlice.actions.deleteError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              path: normalizedPath
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
      const previousPath = normalizeFolderPath(action.payload.path)
      const nextName = normalizeFolderPath(action.payload.name)
      const parentPath = previousPath.includes('/')
        ? previousPath.slice(0, previousPath.lastIndexOf('/'))
        : ''
      const nextPath = parentPath ? `${parentPath}/${nextName}` : nextName
      const existingPaths = Array.from(
        getAvailableFolderPaths([...state.folders.assignedPaths, ...state.folders.persistedPaths])
      )

      if (!nextName) {
        return of(
          foldersSlice.actions.renameError({
            error: {message: 'Folder name cannot be empty', statusCode: 400}
          })
        )
      }

      if (nextPath === previousPath) {
        return of(
          foldersSlice.actions.renameError({
            error: {message: 'Folder name has not changed', statusCode: 400}
          })
        )
      }

      if (nextPath.startsWith(`${previousPath}/`)) {
        return of(
          foldersSlice.actions.renameError({
            error: {message: 'Folder cannot be renamed inside itself', statusCode: 400}
          })
        )
      }

      if (
        existingPaths.some(
          path =>
            path === nextPath ||
            (path.startsWith(`${nextPath}/`) && !path.startsWith(`${previousPath}/`))
        )
      ) {
        return of(
          foldersSlice.actions.renameError({
            error: {message: 'A folder with this path already exists', statusCode: 409}
          })
        )
      }

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          client.observable.fetch<{
            assets: {_id: string; folder: string | null}[]
            folders: {_id: string; path: string}[]
          }>(
            groq`{
              "assets": *[
                _type in ${JSON.stringify(
                  state.assets.assetTypes.map(type => `sanity.${type}Asset`)
                )}
                && !(_id in path("drafts.**"))
                && defined(opt.media.folder)
                && (opt.media.folder == $path || opt.media.folder match $pathMatch)
              ] {
                _id,
                "folder": opt.media.folder
              },
              "folders": *[
                _type == "${FOLDER_DOCUMENT_NAME}"
                && !(_id in path("drafts.**"))
                && (path == $path || path match $pathMatch)
              ] {
                _id,
                path
              }
            }`,
            {path: previousPath, pathMatch: `${previousPath}/**`}
          )
        ),
        mergeMap(result => {
          const transaction: Transaction = result.assets.reduce((tx, asset) => {
            const folderPath =
              replaceFolderPrefix({
                nextPath,
                path: asset.folder,
                previousPath
              }) || null

            if (!folderPath) {
              return tx
            }

            return tx.patch(asset._id, patchOperationAssetFolderSet({folderPath}))
          }, client.transaction())

          const patchedTransaction = result.folders.reduce((tx, folder) => {
            const path = replaceFolderPrefix({
              nextPath,
              path: folder.path,
              previousPath
            })

            return path ? tx.patch(folder._id, patchOperationFolderPathSet({path})) : tx
          }, transaction)

          if (result.folders.length === 0) {
            patchedTransaction.create({
              _id: `${FOLDER_DOCUMENT_NAME}.${nanoid()}`,
              _type: FOLDER_DOCUMENT_NAME,
              path: nextPath
            })
          }

          return patchedTransaction.commit()
        }),
        mergeMap(() =>
          of(
            foldersSlice.actions.renameComplete({
              nextPath,
              previousPath
            })
          )
        ),
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

const selectAssignedPaths = (state: RootReducerState) => state.folders.assignedPaths
const selectPersistedPaths = (state: RootReducerState) => state.folders.persistedPaths
const selectCurrentFolderPath = (state: RootReducerState) => state.folders.currentFolderPath
const selectCurrentFolderUnfiled = (state: RootReducerState) => state.folders.currentFolderUnfiled

export const selectFolderTree = createSelector(
  [selectAssignedPaths, selectPersistedPaths],
  (assignedPaths, persistedPaths) => {
    const exactCount = new Map<string, number>()
    const totalCount = new Map<string, number>()
    const pathSet = getAvailableFolderPaths([...assignedPaths, ...persistedPaths])
    const persistedPathSet = new Set(persistedPaths.map(path => normalizeFolderPath(path)))

    assignedPaths.forEach(path => {
      const normalizedPath = normalizeFolderPath(path)
      if (!normalizedPath) {
        return
      }

      exactCount.set(normalizedPath, (exactCount.get(normalizedPath) || 0) + 1)

      normalizedPath.split('/').reduce((acc, segment) => {
        const nextPath = acc ? `${acc}/${segment}` : segment
        pathSet.add(nextPath)
        totalCount.set(nextPath, (totalCount.get(nextPath) || 0) + 1)
        return nextPath
      }, '')
    })

    const nodes = new Map<string, FolderTreeNode>()
    const rootNodes: FolderTreeNode[] = []

    Array.from(pathSet)
      .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}))
      .forEach(path => {
        const node: FolderTreeNode = {
          children: [],
          exactCount: exactCount.get(path) || 0,
          name: path.split('/').pop() || path,
          path,
          persisted: persistedPathSet.has(path),
          totalCount: totalCount.get(path) || 0
        }

        nodes.set(path, node)

        const parentPath = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : null
        if (parentPath && nodes.has(parentPath)) {
          nodes.get(parentPath)?.children.push(node)
        } else {
          rootNodes.push(node)
        }
      })

    return rootNodes
  }
)

export const selectCurrentFolderSegments = createSelector(
  [(state: RootReducerState) => state.folders.currentFolderPath],
  currentFolderPath => {
    if (!currentFolderPath) {
      return []
    }

    return currentFolderPath.split('/').reduce((acc: FolderTreeItem[], segment) => {
      const previousPath = acc[acc.length - 1]?.path
      const path = previousPath ? `${previousPath}/${segment}` : segment

      acc.push({
        depth: acc.length,
        exactCount: 0,
        name: segment,
        path,
        totalCount: 0
      })

      return acc
    }, [])
  }
)

export const selectUnfiledCount = createSelector([selectAssignedPaths], assignedPaths => {
  return assignedPaths.filter(path => !normalizeFolderPath(path)).length
})

export const selectCurrentFolderChildren = createSelector(
  [selectAssignedPaths, selectPersistedPaths, selectCurrentFolderPath, selectCurrentFolderUnfiled],
  (assignedPaths, persistedPaths, currentFolderPath, currentFolderUnfiled) => {
    if (currentFolderUnfiled) {
      return [] as FolderTreeItem[]
    }

    const childCounts = new Map<string, number>()
    const availablePaths = Array.from(
      getAvailableFolderPaths([...assignedPaths, ...persistedPaths])
    )
    const persistedPathSet = new Set(persistedPaths.map(path => normalizeFolderPath(path)))

    assignedPaths.forEach(path => {
      const normalizedPath = normalizeFolderPath(path)
      if (!normalizedPath) {
        return
      }

      availablePaths.forEach(folderPath => {
        const isCurrentLevelChild = currentFolderPath
          ? folderPath.startsWith(`${currentFolderPath}/`) &&
            folderPath.slice(currentFolderPath.length + 1).split('/').length === 1
          : !folderPath.includes('/')

        if (
          (normalizedPath === folderPath || normalizedPath.startsWith(`${folderPath}/`)) &&
          isCurrentLevelChild
        ) {
          childCounts.set(folderPath, (childCounts.get(folderPath) || 0) + 1)
        }
      })
    })

    return availablePaths
      .filter(folderPath => {
        if (!currentFolderPath) {
          return !folderPath.includes('/')
        }

        if (!folderPath.startsWith(`${currentFolderPath}/`)) {
          return false
        }

        return folderPath.slice(currentFolderPath.length + 1).split('/').length === 1
      })
      .sort((pathA, pathB) =>
        pathA.localeCompare(pathB, undefined, {numeric: true, sensitivity: 'base'})
      )
      .map(
        (path): FolderTreeItem => ({
          depth: currentFolderPath ? currentFolderPath.split('/').length : 0,
          exactCount: 0,
          name: path.split('/').pop() || path,
          path,
          persisted: persistedPathSet.has(path),
          totalCount: childCounts.get(path) || 0
        })
      )
  }
)

export const selectCanDeleteFolder = createSelector(
  [selectFolderTree, selectCurrentFolderPath],
  (folderTree, currentFolderPath) => {
    if (!currentFolderPath) {
      return false
    }

    const queue = [...folderTree]
    while (queue.length > 0) {
      const currentNode = queue.shift()
      if (!currentNode) {
        continue
      }

      if (currentNode.path === currentFolderPath) {
        return (
          !!currentNode.persisted &&
          currentNode.exactCount === 0 &&
          currentNode.children.length === 0
        )
      }

      queue.push(...currentNode.children)
    }

    return false
  }
)

export const foldersActions = {...foldersSlice.actions}

export default foldersSlice.reducer
