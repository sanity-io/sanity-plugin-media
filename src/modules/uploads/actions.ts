import {createAction} from '@reduxjs/toolkit'
import type {SanityAssetDocument, SanityImageAssetDocument} from '@sanity/client'

export const UPLOADS_ACTIONS = {
  uploadComplete: createAction(
    'uploads/uploadComplete',
    function prepare({asset}: {asset: SanityAssetDocument | SanityImageAssetDocument}) {
      return {
        payload: {asset}
      }
    }
  )
}
