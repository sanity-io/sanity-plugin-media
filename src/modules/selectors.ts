import {createSelector} from '@reduxjs/toolkit'
import type {CardAssetData, CardFolderData, CardUploadData} from '../types'
import {selectCurrentFolderChildren} from './folders'

import type {RootReducerState} from './types'

export const selectCombinedItems = createSelector(
  [
    (state: RootReducerState) => state.assets.allIds,
    (state: RootReducerState) => state.uploads.allIds,
    selectCurrentFolderChildren
  ],
  (assetIds, uploadIds, folderChildren) => {
    const assetItems = assetIds.map(id => ({id, type: 'asset'} as CardAssetData))
    const folderItems = folderChildren.map(
      folder =>
        ({
          id: `folder:${folder.path}`,
          name: folder.name,
          path: folder.path,
          totalCount: folder.totalCount,
          type: 'folder'
        } as CardFolderData)
    )
    const uploadItems = uploadIds.map(id => ({id, type: 'upload'} as CardUploadData))
    const combinedItems: (CardAssetData | CardFolderData | CardUploadData)[] = [
      ...folderItems,
      ...uploadItems,
      ...assetItems
    ]
    return combinedItems
  }
)
