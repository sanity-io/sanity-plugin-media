import {createSlice} from '@reduxjs/toolkit'
import type {SanityAssetDocument, SanityDocument, SanityImageAssetDocument} from '@sanity/client'

type SelectedReducerState = {
  assets: (SanityAssetDocument | SanityImageAssetDocument)[]
  document?: SanityDocument
  documentAssetIds?: string[]
}

const initialState = {
  assets: [],
  document: undefined,
  documentAssetIds: []
} as SelectedReducerState

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {}
})

export default selectedSlice.reducer
