import {createSelector} from '@reduxjs/toolkit'
import {CardAssetData, CardUploadData} from '@types'

import {RootReducerState} from './types'

export const selectCombinedItems = createSelector(
  [
    (state: RootReducerState) => state.assets.allIds,
    (state: RootReducerState) => state.uploads.allIds
  ],
  (assetIds, uploadIds) => {
    const assetItems = assetIds.map(id => ({id, type: 'asset'} as CardAssetData))
    const uploadItems = uploadIds.map(id => ({id, type: 'upload'} as CardUploadData))
    const combinedItems: (CardAssetData | CardUploadData)[] = [...uploadItems, ...assetItems]
    return combinedItems
  }
)
