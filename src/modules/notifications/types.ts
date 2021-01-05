import {Asset} from '@types'
import {ReactNode} from 'react'
import {NotificationsActionTypes} from './index'

type Notification = {
  asset?: Asset
  status?: 'error' | 'warning' | 'success' | 'info'
  subtitle?: string
  timeout?: number
  title?: ReactNode
}

// Reducer

export type NotificationsReducerState = {
  items: Notification[]
}

// Actions

export type NotificationsAddAction = {
  payload: Notification
  type: NotificationsActionTypes.ADD
}

// All actions

export type NotificationsActions = NotificationsAddAction
