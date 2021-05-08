import type {SanityDocument} from '@sanity/client'

const isPlainObject = (value: any) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

// Recursively search node for any linked asset ids (`asset._type === 'reference'`)
const getAssetIds = (node: Record<string, any>, acc: string[] = []) => {
  if (Array.isArray(node)) {
    node.forEach(v => {
      getAssetIds(v, acc)
    })
  }

  if (isPlainObject(node)) {
    if (node?.asset?._type === 'reference' && node?.asset?._ref) {
      acc.push(node.asset._ref)
    }

    Object.values(node).forEach(val => {
      getAssetIds(val, acc)
    })
  }

  return acc
}

// Retrieve all linked asset ids from a Sanity document
const getDocumentAssetIds = (document: SanityDocument): string[] => {
  const assetIds = getAssetIds(document)

  // Sort and dedupe
  return [...new Set(assetIds.sort())]
}

export default getDocumentAssetIds
