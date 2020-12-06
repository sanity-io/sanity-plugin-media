import {Asset} from '@types'

const getAssetResolution = (asset: Asset) => {
  return `${asset.metadata.dimensions.width}x${asset.metadata.dimensions.height}px`
}

export default getAssetResolution
