import {type ReactNode, createContext, useContext} from 'react'
import type {AssetSourceComponentProps} from 'sanity'

type ContextProps = {
  isMultiSelect: boolean
  onSelect?: AssetSourceComponentProps['onSelect']
}

type Props = {
  children: ReactNode
  isMultiSelect?: boolean
  onSelect?: AssetSourceComponentProps['onSelect']
}

const AssetSourceDispatchContext = createContext<ContextProps | undefined>(undefined)

export const AssetBrowserDispatchProvider = (props: Props) => {
  const {children, isMultiSelect = false, onSelect} = props

  const contextValue: ContextProps = {
    isMultiSelect,
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
