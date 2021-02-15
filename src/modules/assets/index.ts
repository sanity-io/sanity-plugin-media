import {AnyAction, PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit'
import {ClientError, Patch, Transaction} from '@sanity/client'
import {Asset, BrowserView, AssetItem, HttpError, Order, OrderDirection, Tag} from '@types'
import groq from 'groq'
import {nanoid} from 'nanoid'
import client from 'part:@sanity/base/client'
import {Epic, ofType} from 'redux-observable'
import {Selector} from 'react-redux'
import {empty, from, of} from 'rxjs'
import {
  bufferTime,
  catchError,
  debounceTime,
  filter,
  mergeAll,
  mergeMap,
  switchMap,
  withLatestFrom
} from 'rxjs/operators'

import {getOrderTitle} from '../../config/orders'
import {ORDER_OPTIONS} from '../../constants'
import constructFilter from '../../utils/constructFilter'
import debugThrottle from '../../operators/debugThrottle'
import {RootReducerState} from '../types'
import {searchActions} from '../search'

export type AssetsReducerState = {
  allIds: string[]
  byIds: Record<string, AssetItem>
  fetchCount: number
  fetching: boolean
  fetchingError?: HttpError
  lastPicked?: string
  order: Order
  pageIndex: number
  pageSize: number
  view: BrowserView
  // totalCount: number
}

const defaultOrder = ORDER_OPTIONS[0] as {
  direction: OrderDirection
  field: string
}

/**
 * NOTE:
 * `fetchCount` returns the number of items retrieved in the most recent fetch.
 * This is a temporary workaround to be able to determine when there are no more items to retrieve.
 * Typically this would be done by deriving the total number of assets upfront, but currently such
 * queries in GROQ aren't fast enough to use on large datasets (1000s of entries).
 *
 * TODO:
 * When the query engine has been improved and above queries are faster, remove all instances of
 * of `fetchCount` and reinstate `totalCount` across the board.
 */

const initialState = {
  allIds: [],
  byIds: {},
  fetchCount: -1,
  fetching: false,
  fetchingError: undefined,
  lastPicked: undefined,
  order: {
    direction: defaultOrder.direction,
    field: defaultOrder.field,
    title: getOrderTitle(defaultOrder.field, defaultOrder.direction)
  },
  pageIndex: 0,
  pageSize: 50,
  view: 'grid'
  // totalCount: -1
} as AssetsReducerState

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    // Clear asset order
    clear(state) {
      state.allIds = []
    },
    deleteComplete(state, action: PayloadAction<{assetId: string; closeDialogId?: string}>) {
      const assetId = action.payload?.assetId
      const deleteIndex = state.allIds.indexOf(assetId)

      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1)
      }
      delete state.byIds[assetId]
    },
    deleteError(state, action: PayloadAction<{asset: Asset; error: HttpError}>) {
      const {asset, error} = action.payload
      const assetId = asset?._id
      state.byIds[assetId].error = error
      state.byIds[assetId].updating = false
    },
    deletePicked() {
      //
    },
    deleteRequest(state, action: PayloadAction<{asset: Asset; closeDialogId?: string}>) {
      const assetId = action.payload?.asset?._id
      state.byIds[assetId].picked = false
      state.byIds[assetId].updating = true

      Object.keys(state.byIds).forEach(key => {
        delete state.byIds[key].error
      })
    },
    fetchComplete(state, action: PayloadAction<{assets: Asset[]}>) {
      const assets = action.payload?.assets || []

      if (assets) {
        assets.forEach(asset => {
          state.allIds.push(asset._id)
          state.byIds[asset._id] = {
            asset: asset,
            picked: false,
            updating: false
          }
        })
      }

      state.fetching = false
      state.fetchCount = assets.length || 0
      delete state.fetchingError
    },
    fetchError(state, action: PayloadAction<HttpError>) {
      const error = action.payload
      state.fetching = false
      state.fetchingError = error
    },
    fetchRequest: {
      reducer: (state, _action: PayloadAction<{params: Record<string, string>; query: string}>) => {
        state.fetching = true
        delete state.fetchingError
      },
      prepare: ({
        filter,
        params = {},
        selector = ``,
        sort = groq`order(_updatedAt desc)`
      }: {
        filter: string
        params?: Record<string, string>
        replace?: boolean
        selector?: string
        sort?: string
      }) => {
        const pipe = sort || selector ? '|' : ''

        // Construct query
        const query = groq`
          {
            "items": *[${filter}] {
              _id,
              _type,
              _createdAt,
              _updatedAt,
              altText,
              description,
              extension,
              metadata {
                dimensions,
                exif,
                isOpaque,
              },
              mimeType,
              opt {
                media
              },
              originalFilename,
              size,
              title,
              url
            } ${pipe} ${sort} ${selector},
          }
        `

        return {payload: {params, query}}
      }
    },
    listenerDeleteComplete(state, action: PayloadAction<{assetIds: string[]}>) {
      const assetIds = action.payload?.assetIds
      assetIds?.forEach(assetId => {
        const deleteIndex = state.allIds.indexOf(assetId)
        if (deleteIndex >= 0) {
          state.allIds.splice(deleteIndex, 1)
        }
        delete state.byIds[assetId]
      })
    },
    listenerDeleteQueue(_state, _action: PayloadAction<{assetId: string}>) {
      //
    },
    listenerUpdateComplete(state, action: PayloadAction<{assets: Asset[]}>) {
      const assets = action.payload?.assets
      assets?.forEach(asset => {
        if (state.byIds[asset?._id]?.asset) {
          state.byIds[asset._id].asset = asset
        }
      })
    },
    listenerUpdateQueue(_state, _action: PayloadAction<{asset: Asset}>) {
      //
    },
    loadNextPage() {
      //
    },
    loadPageIndex(state, action: PayloadAction<{pageIndex: number}>) {
      //
      state.pageIndex = action.payload.pageIndex
    },
    orderSet(state, action: PayloadAction<{order: Order}>) {
      state.order = action.payload?.order
      state.pageIndex = 0
    },
    pick(state, action: PayloadAction<{assetId: string; picked: boolean}>) {
      const {assetId, picked} = action.payload

      state.byIds[assetId].picked = picked
      state.lastPicked = picked ? assetId : undefined
    },
    pickAll(state) {
      state.allIds.forEach(id => {
        state.byIds[id].picked = true
      })
    },
    pickClear(state) {
      state.lastPicked = undefined
      Object.values(state.byIds).forEach(asset => {
        state.byIds[asset.asset._id].picked = false
      })
    },
    pickRange(state, action: PayloadAction<{endId: string; startId: string}>) {
      const startIndex = state.allIds.findIndex(id => id === action.payload.startId)
      const endIndex = state.allIds.findIndex(id => id === action.payload.endId)

      // Sort numerically, ascending order
      const indices = [startIndex, endIndex].sort((a, b) => a - b)

      state.allIds.slice(indices[0], indices[1] + 1).forEach(key => {
        state.byIds[key].picked = true
      })
      state.lastPicked = state.allIds[endIndex]
    },
    sort(state) {
      state.allIds.sort((a, b) => {
        const tagA = state.byIds[a].asset[state.order.field]
        const tagB = state.byIds[b].asset[state.order.field]

        if (tagA < tagB) {
          return state.order.direction === 'asc' ? -1 : 1
        } else if (tagA > tagB) {
          return state.order.direction === 'asc' ? 1 : -1
        } else {
          return 0
        }
      })
    },
    tagsAddComplete(state, action: PayloadAction<{assets: AssetItem[]; tag: Tag}>) {
      const {assets} = action.payload
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = false
      })
    },
    tagsAddError(state, action: PayloadAction<{assets: AssetItem[]; error: HttpError; tag: Tag}>) {
      const {assets} = action.payload
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = false
      })
    },
    tagsAddRequest(state, action: PayloadAction<{assets: AssetItem[]; tag: Tag}>) {
      const {assets} = action.payload
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = true
      })
    },
    tagsRemoveComplete(state, action: PayloadAction<{assets: AssetItem[]; tag: Tag}>) {
      const {assets} = action.payload
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = false
      })
    },
    tagsRemoveError(
      state,
      action: PayloadAction<{assets: AssetItem[]; error: HttpError; tag: Tag}>
    ) {
      const {assets} = action.payload
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = false
      })
    },
    tagsRemoveRequest(state, action: PayloadAction<{assets: AssetItem[]; tag: Tag}>) {
      const {assets} = action.payload
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = true
      })
    },
    updateComplete(state, action: PayloadAction<{assetId: string; closeDialogId?: string}>) {
      const assetId = action.payload?.assetId
      state.byIds[assetId].updating = false
    },
    updateError(state, action: PayloadAction<{asset: Asset; error: HttpError}>) {
      const {asset, error} = action.payload

      const assetId = asset?._id
      state.byIds[assetId].error = error
      state.byIds[assetId].updating = false
    },
    updateRequest(
      state,
      action: PayloadAction<{asset: Asset; closeDialogId?: string; formData: Record<string, any>}>
    ) {
      const assetId = action.payload?.asset?._id
      state.byIds[assetId].updating = true
    },
    viewSet(state, action: PayloadAction<{view: BrowserView}>) {
      state.view = action.payload?.view
    }
  }
})

// Epics

type MyEpic = Epic<AnyAction, AnyAction, RootReducerState>

export const assetsDeleteEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(assetsActions.deleteRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {asset} = action.payload
      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => from(client.delete(asset._id))),
        mergeMap(() => of(assetsActions.deleteComplete({assetId: asset._id}))),
        catchError((error: ClientError) =>
          of(
            assetsActions.deleteError({
              asset,
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

export const assetsDeletePickedEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(assetsActions.deletePicked.match),
    withLatestFrom(state$),
    mergeMap(([_, state]) => {
      const availableItems = Object.entries(state.assets.byIds).filter(([, value]) => {
        return value.picked && !value.updating
      })

      if (availableItems.length === 0) {
        return empty()
      }

      const assets = availableItems.map(item => item[1].asset)
      return of(assets)
    }),
    mergeAll(),
    mergeMap(asset => of(assetsActions.deleteRequest({asset})))
  )

export const assetsFetchEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(assetsActions.fetchRequest.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const params = action.payload?.params
      const query = action.payload?.query

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() => from(client.fetch(query, params))),
        mergeMap((result: any) => {
          const {
            items
            // totalCount
          } = result
          return of(assetsActions.fetchComplete({assets: items}))
        }),
        catchError((error: ClientError) =>
          of(
            assetsActions.fetchError({
              message: error?.message || 'Internal error',
              statusCode: error?.statusCode || 500
            })
          )
        )
      )
    })
  )

export const assetsFetchPageIndexEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(assetsActions.loadPageIndex.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const pageSize = state.assets.pageSize
      const start = action.payload.pageIndex * pageSize
      const end = start + pageSize

      const documentId = state?.document?._id

      return of(
        assetsActions.fetchRequest({
          filter: constructFilter({
            hasDocument: !!state.document,
            searchFacets: state.search.facets,
            searchQuery: state.search.query
          }),
          // Document ID can be null when operating on pristine / unsaved drafts
          ...(documentId ? {params: {documentId}} : {}),
          selector: groq`[${start}...${end}]`,
          sort: groq`order(${state.assets?.order?.field} ${state.assets?.order?.direction})`
        })
      )
    })
  )

export const assetsFetchNextPageEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(assetsActions.loadNextPage.match),
    withLatestFrom(state$),
    switchMap(([_, state]) => {
      return of(assetsActions.loadPageIndex({pageIndex: state.assets.pageIndex + 1}))
    })
  )

export const assetsRemoveTagsEpic: MyEpic = (action$, state$) => {
  return action$.pipe(
    filter(assetsActions.tagsAddRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {assets, tag} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Add tag references to all picked assets
        mergeMap(() => {
          const pickedAssets = selectAssetsPicked(state)

          // Filter out picked assets which already include tag
          const pickedAssetsFiltered = pickedAssets?.filter(assetItem => {
            const tagIndex =
              assetItem?.asset?.opt?.media?.tags?.findIndex(t => t._ref === tag?._id) ?? -1
            return tagIndex < 0
          })

          const transaction: Transaction = pickedAssetsFiltered.reduce(
            (transaction, pickedAsset) => {
              return transaction.patch(pickedAsset?.asset?._id, (patch: Patch) =>
                patch
                  .setIfMissing({opt: {}})
                  .setIfMissing({'opt.media': {}})
                  .setIfMissing({'opt.media.tags': []})
                  .append('opt.media.tags', [
                    {_key: nanoid(), _ref: tag?._id, _type: 'reference', _weak: true}
                  ])
              )
            },
            client.transaction()
          )

          return from(transaction.commit())
        }),
        // Dispatch complete action
        mergeMap(() => of(assetsActions.tagsAddComplete({assets, tag}))),
        catchError((error: ClientError) =>
          of(
            assetsActions.tagsAddError({
              assets,
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              tag
            })
          )
        )
      )
    })
  )
}

export const assetsOrderSetEpic: MyEpic = action$ =>
  action$.pipe(
    filter(assetsActions.orderSet.match),
    switchMap(() => {
      return of(
        assetsActions.clear(), //
        assetsActions.loadPageIndex({pageIndex: 0})
      )
    })
  )

export const assetsSearchEpic: MyEpic = action$ =>
  action$.pipe(
    ofType(
      searchActions.facetsAdd.type,
      searchActions.facetsClear.type,
      searchActions.facetsRemove.type,
      searchActions.facetsUpdate.type,
      searchActions.querySet.type
    ),
    debounceTime(400),
    switchMap(() => {
      return of(
        assetsActions.clear(), //
        assetsActions.loadPageIndex({pageIndex: 0})
      )
    })
  )

export const assetsListenerDeleteQueueEpic: MyEpic = action$ =>
  action$.pipe(
    filter(assetsActions.listenerDeleteQueue.match),
    bufferTime(2000),
    filter(actions => actions.length > 0),
    switchMap(actions => {
      const assetIds = actions?.map(action => action.payload.assetId)
      return of(assetsActions.listenerDeleteComplete({assetIds}))
    })
  )

export const assetsListenerUpdateQueueEpic: MyEpic = action$ =>
  action$.pipe(
    filter(assetsActions.listenerUpdateQueue.match),
    bufferTime(2000),
    filter(actions => actions.length > 0),
    switchMap(actions => {
      const assets = actions?.map(action => action.payload.asset)
      return of(assetsActions.listenerUpdateComplete({assets}))
    })
  )

export const assetsSortEpic: MyEpic = action$ =>
  action$.pipe(
    ofType(
      assetsActions.listenerUpdateComplete.type, //
      assetsActions.updateComplete.type
    ),
    bufferTime(1000),
    filter(actions => actions.length > 0),
    switchMap(() => {
      return of(assetsActions.sort())
    })
  )

export const assetsTagsAddEpic: MyEpic = (action$, state$) => {
  return action$.pipe(
    filter(assetsActions.tagsAddRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {assets, tag} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Add tag references to all picked assets
        mergeMap(() => {
          const pickedAssets = selectAssetsPicked(state)

          // Filter out picked assets which already include tag
          const pickedAssetsFiltered = pickedAssets?.filter(assetItem => {
            const tagIndex =
              assetItem?.asset?.opt?.media?.tags?.findIndex(t => t._ref === tag?._id) ?? -1
            return tagIndex < 0
          })

          const transaction: Transaction = pickedAssetsFiltered.reduce(
            (transaction, pickedAsset) => {
              return transaction.patch(pickedAsset?.asset?._id, (patch: Patch) =>
                patch
                  .ifRevisionId(pickedAsset?.asset?._rev)
                  .setIfMissing({opt: {}})
                  .setIfMissing({'opt.media': {}})
                  .setIfMissing({'opt.media.tags': []})
                  .append('opt.media.tags', [
                    {_key: nanoid(), _ref: tag?._id, _type: 'reference', _weak: true}
                  ])
              )
            },
            client.transaction()
          )

          return from(transaction.commit())
        }),
        // Dispatch complete action
        mergeMap(() => of(assetsActions.tagsAddComplete({assets, tag}))),
        catchError((error: ClientError) =>
          of(
            assetsActions.tagsAddError({
              assets,
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              tag
            })
          )
        )
      )
    })
  )
}

export const assetsTagsRemoveEpic: MyEpic = (action$, state$) => {
  return action$.pipe(
    filter(assetsActions.tagsRemoveRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {assets, tag} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Remove tag references from all picked assets
        mergeMap(() => {
          const pickedAssets = selectAssetsPicked(state)

          const transaction: Transaction = pickedAssets.reduce((transaction, pickedAsset) => {
            return transaction.patch(pickedAsset?.asset?._id, (patch: Patch) =>
              patch
                .ifRevisionId(pickedAsset?.asset?._rev)
                .unset([`opt.media.tags[_ref == "${tag._id}"]`])
            )
          }, client.transaction())

          return from(transaction.commit())
        }),
        // Dispatch complete action
        mergeMap(() => of(assetsActions.tagsRemoveComplete({assets, tag}))),
        catchError((error: ClientError) =>
          of(
            assetsActions.tagsRemoveError({
              assets,
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              },
              tag
            })
          )
        )
      )
    })
  )
}

export const assetsUnpickEpic: MyEpic = action$ =>
  action$.pipe(
    ofType(
      assetsActions.orderSet.type,
      assetsActions.viewSet.type,
      searchActions.facetsAdd.type,
      searchActions.facetsClear.type,
      searchActions.facetsRemove.type,
      searchActions.facetsUpdate.type,
      searchActions.querySet.type
    ),
    switchMap(() => {
      return of(assetsActions.pickClear())
    })
  )

export const assetsUpdateEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(assetsActions.updateRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {asset, closeDialogId, formData} = action.payload

      return of(action).pipe(
        debugThrottle(state.debug.badConnection),
        mergeMap(() =>
          from(
            client
              .patch(asset._id)
              .setIfMissing({opt: {}})
              .setIfMissing({'opt.media': {}})
              .set(formData)
              .commit()
          )
        ),
        mergeMap((updatedAsset: any) =>
          of(
            assetsActions.updateComplete({
              assetId: updatedAsset._id,
              closeDialogId
            })
          )
        ),
        catchError((error: ClientError) =>
          of(
            assetsActions.updateError({
              asset,
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

// Selectors

const selectAssetsByIds = (state: RootReducerState) => state.assets.byIds

const selectAssetsAllIds = (state: RootReducerState) => state.assets.allIds

export const selectAssetById = createSelector(
  [
    (state: RootReducerState) => state.assets.byIds,
    (_state: RootReducerState, assetId: string) => assetId
  ],
  (byIds, assetId) => byIds[assetId]
)

export const selectAssets: Selector<RootReducerState, AssetItem[]> = createSelector(
  [selectAssetsByIds, selectAssetsAllIds],
  (byIds, allIds) => allIds.map(id => byIds[id])
)

export const selectAssetsLength = createSelector([selectAssets], assets => assets.length)

export const selectAssetsPicked = createSelector([selectAssets], assets =>
  assets.filter(item => item?.picked)
)

export const selectAssetsPickedLength = createSelector(
  [selectAssetsPicked],
  assetsPicked => assetsPicked.length
)

export const assetsActions = assetsSlice.actions

export default assetsSlice.reducer
