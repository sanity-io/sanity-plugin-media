import {Asset} from '@types'

export default function (asset: Asset, height: number) {
  const dpi =
    typeof window === 'undefined' || !window.devicePixelRatio
      ? 1
      : Math.round(window.devicePixelRatio)
  const imgH = height * Math.max(1, dpi)

  return `${asset.url}?h=${imgH}&fit=max`
}
