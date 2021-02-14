import {createSlice} from '@reduxjs/toolkit'
import {SanityDocument} from '@sanity/client'

const documentSlice = createSlice({
  name: 'document',
  initialState: null as SanityDocument | null,
  reducers: {}
})

export default documentSlice.reducer
