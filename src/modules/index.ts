import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'

import assets, {assetsDeleteEpic, assetsDeletePickedEpic, assetsFetchEpic} from './assets'
import browser from './browser'
import dialog, {dialogClearEpic, dialogShowConflictsEpic} from './dialog'
import snackbars, {
  snackbarsAddDeleteErrorsEpic,
  snackbarsAddFetchErrorEpic,
  snackbarsAddSuccessEpic
} from './snackbars'

export const rootEpic = combineEpics(
  assetsDeleteEpic,
  assetsDeletePickedEpic,
  assetsFetchEpic,
  dialogClearEpic,
  dialogShowConflictsEpic,
  snackbarsAddDeleteErrorsEpic,
  snackbarsAddFetchErrorEpic,
  snackbarsAddSuccessEpic
)

export const rootReducer = combineReducers({
  assets,
  browser,
  dialog,
  snackbars
})
