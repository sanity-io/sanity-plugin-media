import {AnyAction, PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit'
import {HttpError, SanityUploadProgressEvent, UploadItem} from '@types'
import client from 'part:@sanity/base/client'
import {Epic} from 'redux-observable'
import {Selector} from 'react-redux'
import {empty, from, merge, of} from 'rxjs'
import {
  // bufferTime,
  catchError,
  delay,
  filter,
  mergeMap,
  withLatestFrom
} from 'rxjs/operators'

import {RootReducerState} from '../types'
import constructFilter from '../../utils/constructFilter'
import {hashFile$, uploadAsset$} from '../../utils/uploadSanityAsset'
import {ClientError, SanityAssetDocument, SanityImageAssetDocument} from '@sanity/client'
import groq from 'groq'

export type UploadsReducerState = {
  allIds: string[]
  byIds: Record<string, UploadItem>
}

const initialState = {
  allIds: [],
  byIds: {}
} as UploadsReducerState

const generateLowResPreview = async (file: File): Promise<string> => {
  const lowRes = (img: HTMLImageElement) => {
    return new Promise(resolve => {
      const imageAspect = img.width / img.height

      const canvas: HTMLCanvasElement = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 200 / imageAspect

      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, 200, 200 / imageAspect)

      canvas.toBlob(resolve, 'image/jpeg')
    })
  }

  const createImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise(resolve => {
      const blobUrlLarge = window.URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        window.URL.revokeObjectURL(blobUrlLarge)
        resolve(img)
      }
      img.src = blobUrlLarge
    })
  }

  const imageEl = await createImage(file)
  const blob = await lowRes(imageEl)

  return window.URL.createObjectURL(blob)
}

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState,
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

        const blobUrl = state.byIds[hash].objectUrl
        if (blobUrl) {
          window.URL.revokeObjectURL(blobUrl)
        }

        delete state.byIds[hash]
      })
    },
    previewReady(state, action: PayloadAction<{hash: string; blobUrl: string}>) {
      const {blobUrl, hash} = action.payload
      if (state.byIds[hash]) {
        state.byIds[hash].objectUrl = blobUrl
      }
    },
    uploadComplete(
      state,
      action: PayloadAction<{asset: SanityAssetDocument | SanityImageAssetDocument}>
    ) {
      const {asset} = action.payload

      state.byIds[asset.sha1hash].status = 'complete'
    },
    uploadError(state, action: PayloadAction<{error: HttpError; hash: string}>) {
      const {hash} = action.payload
      const deleteIndex = state.allIds.indexOf(hash)
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1)
      }
      delete state.byIds[hash]
    },
    uploadRequest(_state, _action: PayloadAction<{file: File}>) {
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

type MyEpic = Epic<AnyAction, AnyAction, RootReducerState>

export const uploadsAssetStartEpic: MyEpic = action$ =>
  action$.pipe(
    filter(uploadsActions.uploadStart.match),
    mergeMap(action => {
      const {file, uploadItem} = action.payload
      const assetType = uploadItem.mimeType.indexOf('image') >= 0 ? 'image' : 'file'

      return merge(
        // Generate low res preview
        of(null).pipe(
          mergeMap(() => from(generateLowResPreview(file))),
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
          mergeMap(() => uploadAsset$(assetType, file, uploadItem.hash)),
          mergeMap(event => {
            if (event?.type === 'complete') {
              return of(
                uploadsActions.uploadComplete({
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

export const uploadsAssetUploadEpic: MyEpic = action$ =>
  action$.pipe(
    filter(uploadsActions.uploadRequest.match),
    mergeMap(action => {
      const {file} = action.payload

      return of(action).pipe(
        // Generate SHA1 hash from local file
        mergeMap(() => hashFile$(file)),
        // Ignore if we're unable to generate a hash
        // TODO: we may want to throw an error in `hashFile$` and handle this
        filter(hash => !!hash),
        // Disaptch start action and begin upload process
        mergeMap(hash => {
          const uploadItem = {
            _type: 'upload',
            hash,
            lastModified: file.lastModified,
            mimeType: file.type,
            name: file.name,
            size: file.size,
            status: 'queued'
          } as UploadItem

          return of(uploadsActions.uploadStart({file, uploadItem}))
        })
      )
    })
  )

/*
export const uploadsCompleteQueueEpic: MyEpic = action$ =>
  action$.pipe(
    filter(uploadsActions.uploadComplete.match),
    bufferTime(2000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      return of(
        uploadsActions.checkRequest({
          assets: actions.map(action => action.payload.asset)
        })
      )
    })
  )
*/

export const uploadsCompleteQueueEpic: MyEpic = action$ =>
  action$.pipe(
    filter(uploadsActions.uploadComplete.match),
    mergeMap(action => {
      return of(
        uploadsActions.checkRequest({
          assets: [action.payload.asset]
        })
      )
    })
  )

export const uploadsCheckRequestEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(uploadsActions.checkRequest.match),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const {assets} = action.payload

      const documentIds = assets.map(asset => asset._id)

      const filter = constructFilter({
        hasDocument: !!state.document,
        searchFacets: state.search.facets,
        searchQuery: state.search.query
      })

      const query = groq`
        *[${filter} && _id in $documentIds].sha1hash
      `

      return of(action).pipe(
        delay(1000), // give Sanity some time to register the recently uploaded asset
        mergeMap(() => client.observable.fetch(query, {documentIds})),
        mergeMap((resultHashes: any) => {
          const checkedResults = assets.reduce((acc: Record<string, string | null>, asset) => {
            acc[asset.sha1hash] = resultHashes.includes(asset.sha1hash) ? asset._id : null
            return acc
          }, {})

          return of(uploadsActions.checkComplete({results: checkedResults}))
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
