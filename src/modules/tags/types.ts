import {Tag, TagItem} from '@types'
import {TagsActionTypes} from './index'

// Reducer

export type TagsReducerState = {
  allIds: string[]
  byIds: Record<string, TagItem>
  creating: boolean
  creatingError: any
  fetchCount: number
  fetching: boolean
  fetchingError: any
  // totalCount: number
}

// Actions

export type TagsCreateCompleteAction = {
  payload: {
    options?: {
      assetId?: string
    }
    tag: Tag
  }
  type: TagsActionTypes.CREATE_COMPLETE
}

export type TagsCreateErrorAction = {
  payload: {
    error: {statusCode: number}
    name: string
  }
  type: TagsActionTypes.CREATE_ERROR
}

export type TagsCreateRequestAction = {
  payload: {
    name: string
    options?: {
      assetId?: string
    }
  }
  type: TagsActionTypes.CREATE_REQUEST
}

export type TagsDeleteCompleteAction = {
  payload: {tagId: string}
  type: TagsActionTypes.DELETE_COMPLETE
}

export type TagsDeleteErrorAction = {
  payload: {
    error: {statusCode: number}
    tag: Tag
  }
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
  payload: {
    error: any
  }
  type: TagsActionTypes.FETCH_ERROR
}

export type TagsFetchRequestAction = {
  payload: {
    params?: Record<string, string>
    query: string
  }
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

export type TagsSortAction = {
  type: TagsActionTypes.SORT
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
  | TagsSortAction
