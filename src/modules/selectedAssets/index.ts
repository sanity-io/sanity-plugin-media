import {createSlice} from '@reduxjs/toolkit'
import {SanityAssetDocument, SanityImageAssetDocument} from '@sanity/client'

const selectedAssetsSlice = createSlice({
  name: 'selectedAssets',
  initialState: [] as (SanityAssetDocument | SanityImageAssetDocument)[],
  reducers: {}
})

export default selectedAssetsSlice.reducer
