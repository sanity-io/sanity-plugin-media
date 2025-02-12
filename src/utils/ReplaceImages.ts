import {Asset} from '@types'

export function findImageAssets<T extends {_id: string}>(
  document: T,
  newAsset: T,
  assetToReplaceId: string
): T[] {
  const foundEntries: T[] = []
  findNestedObjects(document, foundEntries, newAsset, assetToReplaceId)
  return foundEntries
}

// Because of GROQ limitations we have to filter all image assets out the document manually
function findNestedObjects<T extends {_id: string; _type?: string; asset?: Asset}>(
  document: T,
  foundEntries: T[],
  newAsset: T,
  assetToReplaceId: string,
  currentPath: string = ''
) {
  if (typeof document !== 'object' || document === null) {
    return
  }

  if (document.hasOwnProperty('_type') && document._type === 'image' && document.asset) {
    const assetProperty = document.asset as Asset
    if (assetProperty.hasOwnProperty('_ref') && assetProperty._ref === assetToReplaceId) {
      const imageObject: any = {}
      document.asset._ref = newAsset._id
      imageObject[currentPath] = document

      if (!foundEntries.find(entry => entry.hasOwnProperty(currentPath))) {
        foundEntries.push(imageObject)
      }
    }
  }

  for (const key in document) {
    if (typeof document[key] === 'object') {
      const newPath = currentPath ? `${currentPath}` : key
      findNestedObjects(document[key] as T, foundEntries, newAsset, assetToReplaceId, newPath)
    }
  }
}
