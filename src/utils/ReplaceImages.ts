export function findImageAssets(document: any, replacementAsset: any, oldId: string) {
  const foundEntries: any[] = []
  findNestedObjects(document, foundEntries, replacementAsset, oldId, '')
  return foundEntries
}

// Because of GROQ limitations we have to filter all image assets out the document manually
function findNestedObjects(
  document: any,
  foundEntries: any[],
  replacementAsset: any,
  oldId: string,
  currentPath: string
) {
  if (typeof document !== 'object' || document === null) {
    return
  }

  if (document.hasOwnProperty('_type') && document._type === 'image') {
    const assetProperty = document.asset
    if (assetProperty.hasOwnProperty('_ref') && assetProperty._ref === oldId) {
      const imageObject: any = {}
      document.asset._ref = replacementAsset._id
      imageObject[currentPath] = document

      if (!foundEntries.find(entry => entry.hasOwnProperty(currentPath))) {
        foundEntries.push(imageObject)
      }
    }
  }

  for (const key in document) {
    if (typeof document[key] === 'object') {
      const newPath = currentPath ? `${currentPath}` : key
      findNestedObjects(document[key], foundEntries, replacementAsset, oldId, newPath)
    }
  }
}
