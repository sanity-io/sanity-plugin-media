import {PayloadAction, createSlice} from '@reduxjs/toolkit'

type DebugReducerState = {
  badConnection: boolean
  enabled: boolean
}

const initialState = {
  badConnection: false,
  enabled: false
} as DebugReducerState

const debugSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    setBadConnection(state, action: PayloadAction<boolean>) {
      state.badConnection = action.payload
    },
    toggleEnabled(state) {
      state.enabled = !state.enabled
    }
  }
})

export const debugActions = debugSlice.actions

export default debugSlice.reducer
