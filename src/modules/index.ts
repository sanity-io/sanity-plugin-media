import {combineReducers} from '@reduxjs/toolkit'
import {combineEpics} from 'redux-observable'

import assetsReducer, {
  assetsDeleteEpic,
  assetsFetchAfterDeleteAllEpic,
  assetsFetchEpic,
  assetsFetchNextPageEpic,
  assetsFetchPageIndexEpic,
  assetsListenerCreateQueueEpic,
  assetsListenerDeleteQueueEpic,
  assetsListenerUpdateQueueEpic,
  assetsOrderSetEpic,
  assetsSearchEpic,
  assetsSortEpic,
  assetsTagsAddEpic,
  assetsTagsRemoveEpic,
  assetsUnpickEpic,
  assetsUpdateEpic
} from './assets'
import debugReducer from './debug'
import dialogReducer, {
  dialogClearOnAssetUpdateEpic,
  dialogTagCreateEpic,
  dialogTagDeleteEpic
} from './dialog'
import selectedReducer from './selected'
import notificationsReducer, {
  notificationsAssetsDeleteErrorEpic,
  notificationsAssetsDeleteCompleteEpic,
  notificationsAssetsTagsAddCompleteEpic,
  notificationsAssetsTagsRemoveCompleteEpic,
  notificationsAssetsUpdateCompleteEpic,
  notificationsGenericErrorEpic,
  notificationsTagCreateCompleteEpic,
  notificationsTagDeleteCompleteEpic,
  notificationsTagUpdateCompleteEpic
} from './notifications'
import searchReducer, {searchFacetTagUpdateEpic} from './search'
import tagsReducer, {
  tagsCreateEpic,
  tagsDeleteEpic,
  tagsFetchEpic,
  tagsListenerCreateQueueEpic,
  tagsListenerDeleteQueueEpic,
  tagsListenerUpdateQueueEpic,
  tagsSortEpic,
  tagsUpdateEpic
} from './tags'
import uploadsReducer, {
  uploadsAssetStartEpic,
  uploadsAssetUploadEpic,
  uploadsCheckRequestEpic,
  uploadsCompleteQueueEpic
} from './uploads'

export const rootEpic = combineEpics(
  assetsDeleteEpic,
  assetsFetchEpic,
  assetsFetchAfterDeleteAllEpic,
  assetsFetchNextPageEpic,
  assetsFetchPageIndexEpic,
  assetsListenerCreateQueueEpic,
  assetsListenerDeleteQueueEpic,
  assetsListenerUpdateQueueEpic,
  assetsOrderSetEpic,
  assetsSearchEpic,
  assetsSortEpic,
  assetsTagsAddEpic,
  assetsTagsRemoveEpic,
  assetsUnpickEpic,
  assetsUpdateEpic,
  dialogClearOnAssetUpdateEpic,
  dialogTagCreateEpic,
  dialogTagDeleteEpic,
  notificationsAssetsDeleteErrorEpic,
  notificationsAssetsDeleteCompleteEpic,
  notificationsAssetsTagsAddCompleteEpic,
  notificationsAssetsTagsRemoveCompleteEpic,
  notificationsAssetsUpdateCompleteEpic,
  notificationsGenericErrorEpic,
  notificationsTagCreateCompleteEpic,
  notificationsTagDeleteCompleteEpic,
  notificationsTagUpdateCompleteEpic,
  searchFacetTagUpdateEpic,
  tagsCreateEpic,
  tagsDeleteEpic,
  tagsFetchEpic,
  tagsListenerCreateQueueEpic,
  tagsListenerDeleteQueueEpic,
  tagsListenerUpdateQueueEpic,
  tagsSortEpic,
  tagsUpdateEpic,
  uploadsAssetStartEpic,
  uploadsAssetUploadEpic,
  uploadsCheckRequestEpic,
  uploadsCompleteQueueEpic
)

const reducers = combineReducers({
  assets: assetsReducer,
  debug: debugReducer,
  dialog: dialogReducer,
  notifications: notificationsReducer,
  search: searchReducer,
  selected: selectedReducer,
  tags: tagsReducer,
  uploads: uploadsReducer
})
export const rootReducer = reducers
