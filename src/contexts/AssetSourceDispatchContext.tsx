import {SelectedAsset} from '@types'
import React, {ReactNode, createContext, useContext} from 'react'

type ContextProps = {
  onSelect?: (assets: SelectedAsset[]) => void
}

type Props = {
  children: ReactNode
  onSelect?: (assets: SelectedAsset[]) => void
}

const AssetSourceDispatchContext = createContext<ContextProps | undefined>(undefined)

export const AssetBrowserDispatchProvider = (props: Props) => {
  const {children, onSelect} = props

  const contextValue: ContextProps = {
    onSelect
  }

  return (
    <AssetSourceDispatchContext.Provider value={contextValue}>
      {children}
    </AssetSourceDispatchContext.Provider>
  )
}

export const useAssetSourceActions = () => {
  const context = useContext(AssetSourceDispatchContext)
  if (context === undefined) {
    throw new Error('useAssetSourceActions must be used within an AssetSourceDispatchProvider')
  }
  return context
}

export default AssetSourceDispatchContext
