import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'

import assets, {
  assetsDeleteEpic,
  assetsDeletePickedEpic,
  assetsFetchEpic,
  assetsFetchNextPageEpic,
  assetsSearchEpic,
  assetsSetOrderEpic,
  assetsFetchPageIndexEpic
} from './assets'
import dialog, {dialogClearEpic} from './dialog'
import document from './document'
import selectedAssets from './selectedAssets'
import snackbars, {
  snackbarsAddDeleteErrorsEpic,
  snackbarsAddFetchErrorEpic,
  snackbarsAddSuccessEpic
} from './snackbars'

export const rootEpic = combineEpics(
  assetsDeleteEpic,
  assetsDeletePickedEpic,
  assetsFetchEpic,
  assetsFetchNextPageEpic,
  assetsFetchPageIndexEpic,
  assetsSearchEpic,
  assetsSetOrderEpic,
  dialogClearEpic,
  snackbarsAddDeleteErrorsEpic,
  snackbarsAddFetchErrorEpic,
  snackbarsAddSuccessEpic
)

export const rootReducer = combineReducers({
  assets,
  dialog,
  document,
  snackbars,
  selectedAssets
})
