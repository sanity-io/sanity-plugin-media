import {createSelector, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {ClientError, SanityAssetDocument, SanityImageAssetDocument} from '@sanity/client'
import type {HttpError, MyEpic, SanityUploadProgressEvent, Tag, UploadItem} from '../../types'
import groq from 'groq'
import {nanoid} from 'nanoid'
import type {Selector} from 'react-redux'
import {empty, forkJoin, from, merge, of} from 'rxjs'
import {catchError, delay, filter, mergeMap, takeUntil, withLatestFrom} from 'rxjs/operators'
import {TAG_DOCUMENT_NAME} from '../../constants'
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
      _action: PayloadAction<{
        createTagsOnUpload?: boolean
        file: File
        forceAsAssetType?: 'file' | 'image'
        mediaTags?: string[]
      }>
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
                  asset: event.asset,
                  createTagsOnUpload: uploadItem.createTagsOnUpload,
                  mediaTags: uploadItem.mediaTags
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
      const {createTagsOnUpload, file, forceAsAssetType, mediaTags} = action.payload

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
            createTagsOnUpload,
            hash,
            mediaTags,
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
      const {asset, createTagsOnUpload, mediaTags} = action.payload
      const actions: ReturnType<
        typeof uploadsActions.checkRequest | typeof UPLOADS_ACTIONS.autoTagRequest
      >[] = [
        uploadsActions.checkRequest({
          assets: [asset]
        })
      ]

      // If mediaTags are specified, dispatch auto-tag request
      if (mediaTags && mediaTags.length > 0) {
        actions.push(
          UPLOADS_ACTIONS.autoTagRequest({
            assetId: asset._id,
            createTagsOnUpload: createTagsOnUpload ?? true,
            mediaTags
          })
        )
      }

      return of(...actions)
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

// Auto-tag epic: resolves tag names to references and applies them to the asset
export const uploadsAutoTagEpic: MyEpic = (action$, _state$, {client}) =>
  action$.pipe(
    filter(UPLOADS_ACTIONS.autoTagRequest.match),
    mergeMap(action => {
      const {assetId, createTagsOnUpload, mediaTags} = action.payload

      // For each tag name, find or optionally create the tag document
      const resolveTag$ = (tagName: string) =>
        from(
          client.fetch<Tag | null>(
            groq`*[_type == "${TAG_DOCUMENT_NAME}" && name.current == $tagName][0]`,
            {tagName}
          )
        ).pipe(
          mergeMap(existingTag => {
            if (existingTag) {
              return of(existingTag)
            }
            // If createTagsOnUpload is enabled, create the tag
            if (createTagsOnUpload) {
              return from(
                client.create({
                  _type: TAG_DOCUMENT_NAME,
                  name: {
                    _type: 'slug',
                    current: tagName
                  }
                }) as Promise<Tag>
              )
            }
            // Otherwise, return null to skip this tag
            return of(null)
          })
        )

      // Resolve all tags in parallel
      return forkJoin(mediaTags.map(resolveTag$)).pipe(
        mergeMap(tags => {
          // Filter out null values (tags that weren't created)
          const validTags = tags.filter((tag): tag is Tag => tag !== null)

          // If no valid tags, skip patching
          if (validTags.length === 0) {
            return of(UPLOADS_ACTIONS.autoTagComplete({assetId}))
          }

          // Build tag references array
          const tagReferences = validTags.map(tag => ({
            _key: nanoid(),
            _ref: tag._id,
            _type: 'reference' as const,
            _weak: true
          }))

          // Patch the asset to add tags
          return from(
            client
              .patch(assetId)
              .setIfMissing({opt: {}})
              .setIfMissing({'opt.media': {}})
              .setIfMissing({'opt.media.tags': []})
              .append('opt.media.tags', tagReferences)
              .commit()
          ).pipe(
            mergeMap(() => of(UPLOADS_ACTIONS.autoTagComplete({assetId}))),
            catchError((error: ClientError) =>
              of(
                UPLOADS_ACTIONS.autoTagError({
                  assetId,
                  error: error?.message || 'Failed to apply tags'
                })
              )
            )
          )
        }),
        catchError((error: ClientError) =>
          of(
            UPLOADS_ACTIONS.autoTagError({
              assetId,
              error: error?.message || 'Failed to resolve tags'
            })
          )
        )
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

export const uploadsActions = {...uploadsSlice.actions}

export default uploadsSlice.reducer
