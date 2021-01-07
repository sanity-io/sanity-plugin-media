import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'

import assets, {
  assetsDeleteEpic,
  assetsDeletePickedEpic,
  assetsFetchEpic,
  assetsFetchNextPageEpic,
  assetsFetchPageIndexEpic,
  assetsSearchEpic,
  assetsSetOrderEpic,
  assetsSortEpic,
  assetsUnpickEpic,
  assetsUpdateEpic
} from './assets'
import debug from './debug'
import dialog, {dialogClearOnAssetUpdateEpic, dialogTagCreateEpic} from './dialog'
import document from './document'
import selectedAssets from './selectedAssets'
import notifications, {
  notificationsAddDeleteErrorsEpic,
  notificationsAddFetchErrorEpic,
  notificationsAddSuccessEpic,
  notificationAddUpdateEpic,
  notificationsAddUpdateErrorEpic
} from './notifications'
import tags, {tagsCreateEpic, tagsDeleteEpic, tagsFetchEpic, tagsSortEpic} from './tags'

export const rootEpic = combineEpics(
  assetsDeleteEpic,
  assetsDeletePickedEpic,
  assetsFetchEpic,
  assetsFetchNextPageEpic,
  assetsFetchPageIndexEpic,
  assetsSearchEpic,
  assetsSetOrderEpic,
  assetsSortEpic,
  assetsUnpickEpic,
  assetsUpdateEpic,
  dialogClearOnAssetUpdateEpic,
  dialogTagCreateEpic,
  notificationsAddDeleteErrorsEpic,
  notificationsAddFetchErrorEpic,
  notificationsAddSuccessEpic,
  notificationAddUpdateEpic,
  notificationsAddUpdateErrorEpic,
  tagsCreateEpic,
  tagsDeleteEpic,
  tagsFetchEpic,
  tagsSortEpic
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
