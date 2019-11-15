import {AssetsActionTypes} from './index'
import {Asset, Item, DeleteHandleTarget} from '../../types'

// Reducer

export type AssetsReducerState = {
  allIds: string[]
  byIds: Record<string, Item>
  fetching: boolean
  // TODO: use correct type
  fetchingError: any
  totalCount: number
}

// Actions

export type AssetsDeleteErrorCompleteAction = {
  payload: {
    asset: Asset
  }
  type: AssetsActionTypes.DELETE_COMPLETE
}

export type AssetsDeleteErrorAction = {
  payload: {
    asset: Asset
    error: {
      statusCode: number
    }
  }
  type: AssetsActionTypes.DELETE_ERROR
}

export type AssetsDeletePickedAction = {
  type: AssetsActionTypes.DELETE_PICKED
}

export type AssetsDeleteRequestAction = {
  payload: {
    asset: Asset
    handleTarget: DeleteHandleTarget
  }
  type: AssetsActionTypes.DELETE_REQUEST
}

export type AssetsFetchCompleteAction = {
  payload: {
    assets: Asset[]
    replace: boolean
    totalCount: number
  }
  type: AssetsActionTypes.FETCH_COMPLETE
}

export type AssetsFetchErrorAction = {
  type: AssetsActionTypes.FETCH_ERROR
}

export type AssetsFetchRequestAction = {
  payload: {
    params: Record<string, string>
    query: string
    replace: boolean
  }
  type: AssetsActionTypes.FETCH_REQUEST
}

export type AssetsPickAction = {
  payload: {
    assetId: string
    picked: boolean
  }
  type: AssetsActionTypes.PICK
}

export type AssetsPickAllAction = {
  type: AssetsActionTypes.PICK_ALL
}

export type AssetsPickClearAction = {
  type: AssetsActionTypes.PICK_CLEAR
}

// All actions

export type AssetsActions =
  | AssetsDeleteErrorCompleteAction
  | AssetsDeleteErrorAction
  | AssetsDeleteRequestAction
  | AssetsFetchCompleteAction
  | AssetsFetchErrorAction
  | AssetsFetchRequestAction
  | AssetsPickAction
  | AssetsPickAllAction
  | AssetsPickClearAction
