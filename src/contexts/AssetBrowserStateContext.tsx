import React, {ReactNode, createContext, useContext} from 'react'

import useTypedSelector from '../hooks/useTypedSelector'
import {Item} from '../types'

type ContextProps = {
  fetchCount: number
  fetching: boolean
  fetchingError: any
  items: Item[]
  // totalCount: number
}

type Props = {
  children: ReactNode
}

const AssetBrowserStateContext = createContext<ContextProps | undefined>(undefined)

export const AssetBrowserStateProvider = (props: Props) => {
  const {children} = props

  const {
    allIds,
    byIds,
    fetchCount,
    fetching,
    fetchingError
    // totalCount
  } = useTypedSelector(state => state.assets)

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
