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
  assetsUnpickAssetsEpic,
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
import tags, {tagsCreateEpic, tagsDeleteEpic, tagsFetchEpic} from './tags'

export const rootEpic = combineEpics(
  assetsDeleteEpic,
  assetsDeletePickedEpic,
  assetsFetchEpic,
  assetsFetchNextPageEpic,
  assetsFetchPageIndexEpic,
  assetsSearchEpic,
  assetsSetOrderEpic,
  assetsUnpickAssetsEpic,
  assetsUpdateEpic,
  dialogClearOnAssetUpdateEpic,
  notificationsAddDeleteErrorsEpic,
  notificationsAddFetchErrorEpic,
  notificationsAddSuccessEpic,
  notificationAddUpdateEpic,
  notificationsAddUpdateErrorEpic,
  tagsCreateEpic,
  tagsDeleteEpic,
  tagsFetchEpic
)

export const rootReducer = combineReducers({
  assets,
  debug,
  dialog,
  document,
  notifications,
  selectedAssets,
  tags
})
