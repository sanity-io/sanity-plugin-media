import {HttpError, Tag, TagItem} from '@types'
import {TagsActionTypes} from './index'

// Reducer

export type TagsReducerState = {
  allIds: string[]
  byIds: Record<string, TagItem>
  creating: boolean
  creatingError?: HttpError
  fetchCount: number
  fetching: boolean
  fetchingError?: HttpError
  // totalCount: number
  panelVisible: boolean
}

// Actions

export type TagsCreateCompleteAction = {
  payload: {assetId?: string; tag: Tag}
  type: TagsActionTypes.CREATE_COMPLETE
}

export type TagsCreateErrorAction = {
  payload: {error: HttpError; name: string}
  type: TagsActionTypes.CREATE_ERROR
}

export type TagsCreateRequestAction = {
  payload: {assetId?: string; name: string}
  type: TagsActionTypes.CREATE_REQUEST
}

export type TagsDeleteCompleteAction = {
  payload: {tagId: string}
  type: TagsActionTypes.DELETE_COMPLETE
}

export type TagsDeleteErrorAction = {
  payload: {error: HttpError; tag: Tag}
  type: TagsActionTypes.DELETE_ERROR
}

export type TagsDeleteRequestAction = {
  payload: {tag: Tag}
  type: TagsActionTypes.DELETE_REQUEST
}

export type TagsFetchCompleteAction = {
  payload: {
    tags: Tag[]
    // totalCount: number
  }
  type: TagsActionTypes.FETCH_COMPLETE
}

export type TagsFetchErrorAction = {
  payload: {error: HttpError}
  type: TagsActionTypes.FETCH_ERROR
}

export type TagsFetchRequestAction = {
  payload: {params?: Record<string, string>; query: string}
  type: TagsActionTypes.FETCH_REQUEST
}

export type TagsListenerCreateAction = {
  payload: {tag: Tag}
  type: TagsActionTypes.LISTENER_CREATE
}

export type TagsListenerDeleteAction = {
  payload: {tagId: string}
  type: TagsActionTypes.LISTENER_DELETE
}

export type TagsListenerUpdateAction = {
  payload: {tag: Tag}
  type: TagsActionTypes.LISTENER_UPDATE
}

export type TagsPanelVisibleSetAction = {
  payload: {panelVisible: boolean}
  type: TagsActionTypes.PANEL_VISIBLE_SET
}

export type TagsSortAction = {
  type: TagsActionTypes.SORT
}

export type TagsUpdateCompleteAction = {
  payload: {closeDialogId?: string; tagId: string}
  type: TagsActionTypes.UPDATE_COMPLETE
}

export type TagsUpdateErrorAction = {
  payload: {error: HttpError; tag: Tag}
  type: TagsActionTypes.UPDATE_ERROR
}

export type TagsUpdateRequestAction = {
  payload: {closeDialogId?: string; formData: Record<string, any>; tag: Tag}
  type: TagsActionTypes.UPDATE_REQUEST
}

// All actions

export type TagsActions =
  | TagsCreateCompleteAction
  | TagsCreateErrorAction
  | TagsCreateRequestAction
  | TagsDeleteCompleteAction
  | TagsDeleteErrorAction
  | TagsDeleteRequestAction
  | TagsFetchCompleteAction
  | TagsFetchErrorAction
  | TagsFetchRequestAction
  | TagsListenerCreateAction
  | TagsListenerDeleteAction
  | TagsListenerUpdateAction
  | TagsPanelVisibleSetAction
  | TagsSortAction
  | TagsUpdateCompleteAction
  | TagsUpdateErrorAction
  | TagsUpdateRequestAction
