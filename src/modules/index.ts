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
import notifications, {
  notificationsAddDeleteErrorsEpic,
  notificationsAddFetchErrorEpic,
  notificationsAddSuccessEpic,
  notificationAddUpdateEpic,
  notificationsAddUpdateErrorEpic
} from './notifications'

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
  notificationsAddDeleteErrorsEpic,
  notificationsAddFetchErrorEpic,
  notificationsAddSuccessEpic,
  notificationAddUpdateEpic,
  notificationsAddUpdateErrorEpic
)

export const rootReducer = combineReducers({
  assets,
  debug,
  dialog,
  document,
  notifications,
  selectedAssets
})
