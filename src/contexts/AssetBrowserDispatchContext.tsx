import React, {ReactNode, createContext, useContext} from 'react'
import {useDispatch} from 'react-redux'
import {
  assetsDelete,
  assetsDeletePicked,
  assetsFetch,
  assetsPick,
  assetsPickAll,
  assetsPickClear
} from '../modules/assets'
import {dialogShowConflicts, dialogShowRefs} from '../modules/dialog'
import {Asset, FetchOptions, SelectedAsset, DeleteHandleTarget} from '../types'

type ContextProps = {
  onDelete: (asset: Asset, handleTarget?: DeleteHandleTarget) => void
  onDeletePicked: () => void
  onDialogShowConflicts: (asset: Asset) => void
  onDialogShowRefs: (asset: Asset) => void
  onFetch: (options: FetchOptions) => void
  onPick: (assetId: string, value: boolean) => void
  onPickAll: () => void
  onPickClear: () => void
  onSelect?: (assets: SelectedAsset[]) => void
}

type Props = {
  children: ReactNode
  onSelect?: (assets: SelectedAsset[]) => void
}

const AssetBrowserDispatchContext = createContext<ContextProps | undefined>(undefined)

export const AssetBrowserDispatchProvider = (props: Props) => {
  const {children, onSelect} = props

  const dispatch = useDispatch()

  const contextValue: ContextProps = {
    onDelete: (asset, handleTarget) => dispatch(assetsDelete(asset, handleTarget)),
    onDeletePicked: () => dispatch(assetsDeletePicked()),
    onDialogShowConflicts: asset => dispatch(dialogShowConflicts(asset)),
    onDialogShowRefs: asset => dispatch(dialogShowRefs(asset)),
    onFetch: (options: FetchOptions) => {
      dispatch(assetsFetch(options))
    },
    onPick: (assetId, value) => dispatch(assetsPick(assetId, value)),
    onPickAll: () => dispatch(assetsPickAll()),
    onPickClear: () => dispatch(assetsPickClear()),
    onSelect
  }

  return (
    <AssetBrowserDispatchContext.Provider value={contextValue}>
      {children}
    </AssetBrowserDispatchContext.Provider>
  )
}

export const useAssetBrowserActions = () => {
  const context = useContext(AssetBrowserDispatchContext)
  if (context === undefined) {
    throw new Error('useAssetBrowserActions must be used within an AssetBrowserDispatchProvider')
  }
  return context
}

export default AssetBrowserDispatchContext
