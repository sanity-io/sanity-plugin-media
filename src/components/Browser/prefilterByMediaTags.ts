import type {AssetSourceComponentProps} from 'sanity'

export function getMediaTagNames(schemaType?: AssetSourceComponentProps['schemaType']): string[] {
  const mediaTags = (schemaType?.options as {mediaTags?: string[]} | undefined)?.mediaTags
  if (!mediaTags?.length) return []

  const unique = new Set(
    mediaTags.map(t => t?.trim()).filter((t): t is string => Boolean(t?.length))
  )
  return Array.from(unique)
}
