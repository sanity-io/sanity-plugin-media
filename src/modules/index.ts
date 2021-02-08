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
  notificationsAssetDeleteErrorEpic,
  notificationsGenericErrorEpic,
  notificationsAssetDeleteCompleteEpic,
  notificationsAssetUpdateCompleteEpic,
  notificationsTagDeleteCompleteEpic
} from './notifications'
import search, {searchFacetTagRemoveEpic, searchFacetTagUpdateEpic} from './search'
import tags, {
  tagsCreateEpic,
  tagsDeleteEpic,
  tagsFetchEpic,
  tagsSortEpic,
  tagsUpdateEpic
} from './tags'

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
  notificationsAssetDeleteErrorEpic,
  notificationsGenericErrorEpic,
  notificationsAssetDeleteCompleteEpic,
  notificationsAssetUpdateCompleteEpic,
  notificationsTagDeleteCompleteEpic,
  searchFacetTagRemoveEpic,
  searchFacetTagUpdateEpic,
  tagsCreateEpic,
  tagsDeleteEpic,
  tagsFetchEpic,
  tagsSortEpic,
  tagsUpdateEpic
)

export const rootReducer = combineReducers({
  assets,
  debug,
  dialog,
  document,
  notifications,
  search,
  selectedAssets,
  tags
})
