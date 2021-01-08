import {ImageAsset} from '@types'

const getAssetResolution = (asset: ImageAsset) => {
  return `${asset.metadata.dimensions.width}x${asset.metadata.dimensions.height}px`
}

export default getAssetResolution
