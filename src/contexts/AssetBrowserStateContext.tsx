import React, {createContext, useContext} from 'react'
import {useSelector as useReduxSelector, TypedUseSelectorHook} from 'react-redux'
import {Item} from '../types'
import {RootReducerState} from '../modules/types'

type ContextProps = {
  fetchCount: number
  fetching: boolean
  fetchingError: any
  items: Item[]
  // totalCount: number
}

type Props = {
  children: React.ReactNode
}

const AssetBrowserStateContext = createContext<ContextProps | undefined>(undefined)

export const AssetBrowserStateProvider = (props: Props) => {
  const {children} = props

  const useSelector: TypedUseSelectorHook<RootReducerState> = useReduxSelector

  const {
    allIds,
    byIds,
    fetchCount,
    fetching,
    fetchingError
    // totalCount
  } = useSelector(state => state.assets)
  // TODO: correctly type redux store
  const items = allIds.map(id => byIds[id])

  const contextValue = {
    fetchCount,
    fetching,
    fetchingError,
    items
    // totalCount
  }

  return (
    <AssetBrowserStateContext.Provider value={contextValue}>
      {children}
    </AssetBrowserStateContext.Provider>
  )
}

export const useAssetBrowserState = () => {
  const context = useContext(AssetBrowserStateContext)
  if (context === undefined) {
    throw new Error('useAssetBrowserState must be used within an AssetBrowserStateProvider')
  }
  return context
}

export default AssetBrowserStateContext
