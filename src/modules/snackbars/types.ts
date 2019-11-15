import {SnackbarsActionTypes} from './index'
import {Asset} from '../../types'

type Snackbar = {
  // TODO: use type from sanity
  asset: Asset
  id: string
  kind: string
  subtitle?: string
  timeout?: number
  title?: React.ReactNode
}

// Reducer

export type SnackbarsReducerState = {
  items: Snackbar[]
}

// Actions

export type SnackbarsAddAction = {
  payload: Snackbar
  type: SnackbarsActionTypes.ADD
}

// All actions

export type SnackbarActions = SnackbarsAddAction
