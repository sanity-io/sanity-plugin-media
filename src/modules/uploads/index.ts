import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {ClientError, SanityAssetDocument, SanityImageAssetDocument} from '@sanity/client'
import type {HttpError, MyEpic, SanityUploadProgressEvent, UploadItem} from '@types'
import groq from 'groq'
import {Selector} from 'react-redux'
import {empty, merge, of} from 'rxjs'
import {catchError, delay, filter, mergeMap, takeUntil, withLatestFrom} from 'rxjs/operators'
import constructFilter from '../../utils/constructFilter'
import {generatePreviewBlobUrl$} from '../../utils/generatePreviewBlobUrl'
import {hashFile$, uploadAsset$} from '../../utils/uploadSanityAsset'
import {assetsActions} from '../assets'
import type {RootReducerState} from '../types'
import {UPLOADS_ACTIONS} from './actions'

export type UploadsReducerState = {
  allIds: string[]
  byIds: Record<string, UploadItem>
}

const initialState = {
  allIds: [],
  byIds: {}
} as UploadsReducerState

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState,
  extraReducers: builder => {
    builder //
      .addCase(UPLOADS_ACTIONS.uploadComplete, (state, action) => {
        const {asset} = action.payload
        if (state.byIds[asset.sha1hash]) {
          state.byIds[asset.sha1hash].status = 'complete'
        }
      })
  },
  reducers: {
    checkRequest(
      _state,
      _action: PayloadAction<{assets: (SanityAssetDocument | SanityImageAssetDocument)[]}>
    ) {
      //
    },
    checkComplete(state, action: PayloadAction<{results: Record<string, string | null>}>) {
      const {results} = action.payload

      const assetHashes = Object.keys(results)

      assetHashes.forEach(hash => {
        const deleteIndex = state.allIds.indexOf(hash)
        if (deleteIndex >= 0) {
          state.allIds.splice(deleteIndex, 1)
        }

        if (state.byIds[hash]) {
          const blobUrl = state.byIds[hash].objectUrl
          if (blobUrl) {
            window.URL.revokeObjectURL(blobUrl)
          }

          delete state.byIds[hash]
        }
      })
    },
    previewReady(state, action: PayloadAction<{hash: string; blobUrl: string}>) {
      const {blobUrl, hash} = action.payload
      if (state.byIds[hash]) {
        state.byIds[hash].objectUrl = blobUrl
      }
    },
    uploadCancel(state, action: PayloadAction<{hash: string}>) {
      const {hash} = action.payload
      const deleteIndex = state.allIds.indexOf(hash)
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1)
      }
      if (state.byIds[hash]) {
        delete state.byIds[hash]
      }
    },
    uploadError(state, action: PayloadAction<{error: HttpError; hash: string}>) {
      const {hash} = action.payload
      const deleteIndex = state.allIds.indexOf(hash)
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1)
      }
      delete state.byIds[hash]
    },
    uploadRequest(
      _state,
      _action: PayloadAction<{file: File; forceAsAssetType?: 'file' | 'image'}>
    ) {
      //
    },
    uploadProgress(
      state,
      action: PayloadAction<{event: SanityUploadProgressEvent; uploadHash: string}>
    ) {
      const {event, uploadHash} = action.payload
      state.byIds[uploadHash].percent = event.percent
      state.byIds[uploadHash].status = 'uploading'
    },
    uploadStart(state, action: PayloadAction<{file: File; uploadItem: UploadItem}>) {
      const {uploadItem} = action.payload
      if (!state.allIds.includes(uploadItem.hash)) {
        state.allIds.push(uploadItem.hash)
      }
      state.byIds[uploadItem.hash] = uploadItem
    }
  }
})

// Epics

export const uploadsAssetStartEpic: MyEpic = (action$, _state$, {client}) =>
  action$.pipe(
    filter(uploadsActions.uploadStart.match),
    mergeMap(action => {
      const {file, uploadItem} = action.payload

      return merge(
        // Generate low res preview
        of(null).pipe(
          mergeMap(() => generatePreviewBlobUrl$(file)),
          mergeMap(url => {
            return of(
              uploadsActions.previewReady({
                blobUrl: url,
                hash: uploadItem.hash
              })
            )
          })
        ),
        // Upload asset and receive progress / complete events
        of(null).pipe(
          // delay(500000), // debug uploads
          mergeMap(() => uploadAsset$(client, uploadItem.assetType, file, uploadItem.hash)),
          takeUntil(
            action$.pipe(
              filter(uploadsActions.uploadCancel.match),
              filter(v => v.payload.hash === uploadItem.hash)
            )
          ),
          mergeMap(event => {
            if (event?.type === 'complete') {
              return of(
                UPLOADS_ACTIONS.uploadComplete({
                  asset: event.asset
                })
              )
            }
            if (event?.type === 'progress' && event?.stage === 'upload') {
              return of(
                uploadsActions.uploadProgress({
                  event,
                  uploadHash: uploadItem.hash
                })
              )
            }
            return empty()
          }),
          catchError((error: ClientError) =>
            of(
              uploadsActions.uploadError({
                error: {
                  message: error?.message || 'Internal error',
                  statusCode: error?.statusCode || 500
                },
                hash: uploadItem.hash
              })
            )
          )
        )
      )
    })
  )

export const uploadsAssetUploadEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(uploadsActions.uploadRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {file, forceAsAssetType} = action.payload

      return of(action).pipe(
        // Generate SHA1 hash from local file
        // This will throw in insecure contexts (non-localhost / https)
        mergeMap(() => hashFile$(file)),
        // Ignore if the file exists and is currently being uploaded
        filter(hash => {
          const exists = !!state.uploads.byIds[hash]
          return !exists
        }),
        // Dispatch start action and begin upload process
        mergeMap(hash => {
          const assetType = forceAsAssetType || (file.type.indexOf('image') >= 0 ? 'image' : 'file')
          const uploadItem = {
            _type: 'upload',
            assetType,
            hash,
            name: file.name,
            size: file.size,
            status: 'queued'
          } as UploadItem
          return of(uploadsActions.uploadStart({file, uploadItem}))
        })
      )
    })
  )

export const uploadsCompleteQueueEpic: MyEpic = action$ =>
  action$.pipe(
    filter(UPLOADS_ACTIONS.uploadComplete.match),
    mergeMap(action => {
      return of(
        uploadsActions.checkRequest({
          assets: [action.payload.asset]
        })
      )
    })
  )

export const uploadsCheckRequestEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(uploadsActions.checkRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {assets} = action.payload

      const documentIds = assets.map(asset => asset._id)

      const constructedFilter = constructFilter({
        assetTypes: state.assets.assetTypes,
        searchFacets: state.search.facets,
        searchQuery: state.search.query
      })

      const query = groq`
        *[${constructedFilter} && _id in $documentIds].sha1hash
      `

      return of(action).pipe(
        delay(1000), // give Sanity some time to register the recently uploaded asset
        mergeMap(() => client.observable.fetch<string[]>(query, {documentIds})),
        mergeMap(resultHashes => {
          const checkedResults = assets.reduce((acc: Record<string, string | null>, asset) => {
            acc[asset.sha1hash] = resultHashes.includes(asset.sha1hash) ? asset._id : null
            return acc
          }, {})

          return of(
            uploadsActions.checkComplete({results: checkedResults}), //
            assetsActions.insertUploads({results: checkedResults})
          )
        })
      )
    })
  )

// Selectors

const selectUploadsByIds = (state: RootReducerState) => state.uploads.byIds

const selectUploadsAllIds = (state: RootReducerState) => state.uploads.allIds

export const selectUploadById = createSelector(
  [
    (state: RootReducerState) => state.uploads.byIds,
    (_state: RootReducerState, uploadId: string) => uploadId
  ],
  (byIds, uploadId) => byIds[uploadId]
)

export const selectUploads: Selector<RootReducerState, UploadItem[]> = createSelector(
  [selectUploadsByIds, selectUploadsAllIds],
  (byIds, allIds) => allIds.map(id => byIds[id])
)

export const uploadsActions = uploadsSlice.actions

export default uploadsSlice.reducer
