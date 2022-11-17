import React, {ReactNode, createContext, useContext} from 'react'
import type {AssetSourceComponentProps} from 'sanity'

type ContextProps = {
  onSelect?: AssetSourceComponentProps['onSelect']
}

type Props = {
  children: ReactNode
  onSelect?: AssetSourceComponentProps['onSelect']
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
