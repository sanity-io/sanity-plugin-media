export function findImageAssets(
  document: Record<string, unknown>,
  newAsset: Record<string, unknown>,
  assetToReplaceId: string
): any[] {
  const foundEntries: any[] = []
  findNestedObjects(document, foundEntries, newAsset, assetToReplaceId, '')
  return foundEntries
}

// Because of GROQ limitations we have to filter all image assets out the document manually
function findNestedObjects(
  document: any,
  foundEntries: any[],
  newAsset: any,
  assetToReplaceId: string,
  currentPath: string
) {
  if (typeof document !== 'object' || document === null) {
    return
  }

  if (document.hasOwnProperty('_type') && document._type === 'image') {
    const assetProperty = document.asset
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
      findNestedObjects(document[key], foundEntries, newAsset, assetToReplaceId, newPath)
    }
  }
}
