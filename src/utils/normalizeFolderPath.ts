const normalizeFolderPath = (folderPath?: string | null): string => {
  if (!folderPath) {
    return ''
  }

  return folderPath
    .trim()
    .replace(/\\/g, '/')
    .split('/')
    .map(segment => segment.trim())
    .filter(Boolean)
    .join('/')
}

export default normalizeFolderPath
