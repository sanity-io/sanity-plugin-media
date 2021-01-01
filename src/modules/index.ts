import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'

import assets, {
  assetsDeleteEpic,
  assetsDeletePickedEpic,
  assetsFetchEpic,
  assetsFetchNextPageEpic,
  assetsSearchEpic,
  assetsSetOrderEpic,
  assetsFetchPageIndexEpic,
  assetsUpdateEpic
} from './assets'
import debug from './debug'
import dialog, {dialogClearOnAssetUpdateEpic} from './dialog'
import document from './document'
import selectedAssets from './selectedAssets'
import snackbars, {
  snackbarsAddDeleteErrorsEpic,
  snackbarsAddFetchErrorEpic,
  snackbarsAddSuccessEpic,
  snackbarsAddUpdateEpic,
  snackbarsAddUpdateErrorEpic
} from './snackbars'

export const rootEpic = combineEpics(
  assetsDeleteEpic,
  assetsDeletePickedEpic,
  assetsFetchEpic,
  assetsFetchNextPageEpic,
  assetsFetchPageIndexEpic,
  assetsSearchEpic,
  assetsSetOrderEpic,
  assetsUpdateEpic,
  dialogClearOnAssetUpdateEpic,
  snackbarsAddDeleteErrorsEpic,
  snackbarsAddFetchErrorEpic,
  snackbarsAddSuccessEpic,
  snackbarsAddUpdateEpic,
  snackbarsAddUpdateErrorEpic
)

export const rootReducer = combineReducers({
  assets,
  debug,
  dialog,
  document,
  snackbars,
  selectedAssets
})
