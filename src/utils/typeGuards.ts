import {Asset, FileAsset, ImageAsset} from '@types'

export const isPdfAsset = (asset: Asset): asset is FileAsset => {
  return (asset as FileAsset).extension === 'pdf'
}

export const isFileAsset = (asset: Asset): asset is FileAsset => {
  return (
    !isPdfAsset(asset) && !isImageAsset(asset) && (asset as FileAsset)._type === 'sanity.fileAsset'
  )
}

export const isImageAsset = (asset: Asset): asset is ImageAsset => {
  return (asset as ImageAsset)._type === 'sanity.imageAsset'
}
