import {createAction} from '@reduxjs/toolkit'
import type {SanityAssetDocument, SanityImageAssetDocument} from '@sanity/client'

export const UPLOADS_ACTIONS = {
  uploadComplete: createAction(
    'uploads/uploadComplete',
    function prepare({
      asset,
      createTagsOnUpload,
      mediaTags
    }: {
      asset: SanityAssetDocument | SanityImageAssetDocument
      createTagsOnUpload?: boolean
      mediaTags?: string[]
    }) {
      return {
        payload: {asset, createTagsOnUpload, mediaTags}
      }
    }
  ),
  autoTagRequest: createAction(
    'uploads/autoTagRequest',
    function prepare({
      assetId,
      createTagsOnUpload,
      mediaTags
    }: {
      assetId: string
      createTagsOnUpload: boolean
      mediaTags: string[]
    }) {
      return {
        payload: {assetId, createTagsOnUpload, mediaTags}
      }
    }
  ),
  autoTagComplete: createAction(
    'uploads/autoTagComplete',
    function prepare({assetId}: {assetId: string}) {
      return {
        payload: {assetId}
      }
    }
  ),
  autoTagError: createAction(
    'uploads/autoTagError',
    function prepare({assetId, error}: {assetId: string; error: string}) {
      return {
        payload: {assetId, error}
      }
    }
  )
}
