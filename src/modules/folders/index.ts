import {createSelector, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {ClientError} from '@sanity/client'
import groq from 'groq'
import {of} from 'rxjs'
import {catchError, debounceTime, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import normalizeFolderPath from '../../utils/normalizeFolderPath'
import type {FolderTreeItem, FolderTreeNode, HttpError, MyEpic} from '../../types'
import debugThrottle from '../../operators/debugThrottle'
import {assetsActions} from '../assets'
import type {RootReducerState} from '../types'
import {UPLOADS_ACTIONS} from '../uploads/actions'

type FoldersReducerState = {
  assignedPaths: (string | null)[]
  currentFolderPath: string | null
  currentFolderUnfiled: boolean
  fetchCount: number
  fetching: boolean
  fetchingError?: HttpError
  panelVisible: boolean
}

const initialState: FoldersReducerState = {
  assignedPaths: [],
  currentFolderPath: null,
  currentFolderUnfiled: false,
  fetchCount: -1,
  fetching: false,
  fetchingError: undefined,
  panelVisible: true
}

const getAvailableFolderPaths = (assignedPaths: (string | null)[]) => {
  const paths = new Set<string>()

  assignedPaths.forEach(path => {
    const normalizedPath = normalizeFolderPath(path)
    if (!normalizedPath) {
      return
    }

    normalizedPath.split('/').reduce((acc, segment) => {
      const nextPath = acc ? `${acc}/${segment}` : segment
      paths.add(nextPath)
      return nextPath
    }, '')
  })

  return paths
}

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
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
    fetchComplete(state, action: PayloadAction<{assignedPaths: (string | null)[]}>) {
      const assignedPaths = action.payload.assignedPaths.map(path => {
        const normalizedPath = normalizeFolderPath(path)
        return normalizedPath || null
      })

      state.assignedPaths = assignedPaths
      state.fetching = false
      state.fetchCount = assignedPaths.length
      delete state.fetchingError

      const availableFolderPaths = getAvailableFolderPaths(assignedPaths)
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
          client.observable.fetch<{items: {folder: string | null}[]}>(
            groq`{
              "items": *[
                _type in ${JSON.stringify(
                  state.assets.assetTypes.map(type => `sanity.${type}Asset`)
                )}
                && !(_id in path("drafts.**"))
              ] {
                "folder": opt.media.folder
              }
            }`
          )
        ),
        mergeMap(result =>
          of(
            foldersSlice.actions.fetchComplete({
              assignedPaths: result.items.map(item => item.folder || null)
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

const selectAssignedPaths = (state: RootReducerState) => state.folders.assignedPaths
const selectCurrentFolderPath = (state: RootReducerState) => state.folders.currentFolderPath
const selectCurrentFolderUnfiled = (state: RootReducerState) => state.folders.currentFolderUnfiled

export const selectFolderTree = createSelector([selectAssignedPaths], assignedPaths => {
  const exactCount = new Map<string, number>()
  const totalCount = new Map<string, number>()
  const pathSet = new Set<string>()

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
})

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
  [selectAssignedPaths, selectCurrentFolderPath, selectCurrentFolderUnfiled],
  (assignedPaths, currentFolderPath, currentFolderUnfiled) => {
    if (currentFolderUnfiled) {
      return [] as FolderTreeItem[]
    }

    const childCounts = new Map<string, number>()

    assignedPaths.forEach(path => {
      const normalizedPath = normalizeFolderPath(path)
      if (!normalizedPath) {
        return
      }

      if (currentFolderPath) {
        const prefix = `${currentFolderPath}/`
        if (!normalizedPath.startsWith(prefix)) {
          return
        }

        const remainder = normalizedPath.slice(prefix.length)
        const [firstSegment] = remainder.split('/')
        if (!firstSegment || !remainder.includes('/')) {
          return
        }

        const childPath = `${currentFolderPath}/${firstSegment}`
        childCounts.set(childPath, (childCounts.get(childPath) || 0) + 1)
        return
      }

      const [topLevelSegment, ...rest] = normalizedPath.split('/')
      if (!topLevelSegment || rest.length === 0) {
        return
      }

      childCounts.set(topLevelSegment, (childCounts.get(topLevelSegment) || 0) + 1)
    })

    return Array.from(childCounts.entries())
      .sort(([pathA], [pathB]) =>
        pathA.localeCompare(pathB, undefined, {numeric: true, sensitivity: 'base'})
      )
      .map(
        ([path, totalCount]): FolderTreeItem => ({
          depth: currentFolderPath ? currentFolderPath.split('/').length : 0,
          exactCount: 0,
          name: path.split('/').pop() || path,
          path,
          totalCount
        })
      )
  }
)

export const foldersActions = {...foldersSlice.actions}

export default foldersSlice.reducer
