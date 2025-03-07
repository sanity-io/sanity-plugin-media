import type {SanityDocument} from '@sanity/client'

export function getUniqueDocuments(documents: SanityDocument[]): SanityDocument[] {
  const draftIds = documents.reduce(
    (acc: string[], doc: SanityDocument) =>
      doc._id.startsWith('drafts.') ? acc.concat(doc._id.slice(7)) : acc,
    []
  )

  const filteredDocuments: SanityDocument[] = documents.filter(
    (doc: SanityDocument) => !draftIds.includes(doc._id)
  )

  return filteredDocuments
}
