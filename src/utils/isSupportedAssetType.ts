import {SUPPORTED_ASSET_TYPES} from '../constants'
import type {AssetType} from '../types'

/**
 * Determines whether or not the provided asset type (eg 'image', 'file', 'arbitrary')
 * is a supported asset type for this plugin.
 *
 * @param assetType - The asset type to check.
 * @returns True if the asset type is supported, false otherwise.
 * @internal
 */
export function isSupportedAssetType(assetType?: string): assetType is AssetType {
  const supported: string[] = SUPPORTED_ASSET_TYPES
  return assetType ? supported.includes(assetType) : false
}
