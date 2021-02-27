import {SanityDocument} from '@sanity/client'

const isPlainObject = (value: any) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const getAssetIds = (node: Record<string, any>, acc: string[] = []) => {
  if (Array.isArray(node)) {
    node.forEach(v => {
      getAssetIds(v, acc)
    })
  }

  if (isPlainObject(node)) {
    if (['file', 'image'].includes(node?._type) && node?.asset?._type === 'reference') {
      acc.push(node.asset._ref)
    }

    Object.values(node).forEach(val => {
      getAssetIds(val, acc)
    })
  }

  return acc
}

const getDocumentAssetIds = (document: SanityDocument): string[] => {
  const assetIds = getAssetIds(document)

  // Sort and dedupe
  return [...new Set(assetIds.sort())]
}

export default getDocumentAssetIds
