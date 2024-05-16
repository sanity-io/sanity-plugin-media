import {createSlice} from '@reduxjs/toolkit'
import {AssetSourceComponentProps} from 'sanity'

type SelectionTypeReducerState = AssetSourceComponentProps['selectionType'] | 'multiple'

const initialState = 'single' as SelectionTypeReducerState

const selectionTypeSlice = createSlice({
  name: 'selectionType',
  initialState,
  reducers: {}
})

export default selectionTypeSlice.reducer
