import {SanityAssetDocument, SanityImageAssetDocument} from '@sanity/client'

// Reducer

export type SelectedAssetsReducerState = (SanityAssetDocument | SanityImageAssetDocument)[]
