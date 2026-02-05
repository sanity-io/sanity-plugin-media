import type {SanityClient} from '@sanity/client'
import groq from 'groq'
import type {AssetSourceComponentProps} from 'sanity'

import {inputs} from '../../config/searchFacets'
import {TAG_DOCUMENT_NAME} from '../../constants'
import type {SearchFacetInputSearchableProps, Tag} from '../../types'

export type ResolvedMediaTag = {
  id: string
  name: string
  facetInput: SearchFacetInputSearchableProps
}

/**
 * Extracts and normalizes mediaTags from schema field options.
 * Returns unique, trimmed, non-empty tag names.
 */
export function getMediaTagNames(schemaType?: AssetSourceComponentProps['schemaType']): string[] {
  const mediaTags = (schemaType?.options as {mediaTags?: string[]} | undefined)?.mediaTags
  if (!mediaTags?.length) return []

  const unique = new Set(
    mediaTags.map(t => t?.trim()).filter((t): t is string => Boolean(t?.length))
  )
  return Array.from(unique)
}

/**
 * Resolves tag names to tag documents.
 * Returns resolved tags with their IDs and the facet input config,
 * or an empty array if none could be resolved.
 */
export async function seedMediaTagFacets(
  client: SanityClient,
  tagNames: string[]
): Promise<ResolvedMediaTag[]> {
  if (!tagNames.length) return []

  const tagFacetInput = inputs.tag
  if (tagFacetInput.type !== 'searchable') return []

  const resolvedTags = await client.fetch<Array<Pick<Tag, '_id' | 'name'>>>(
    groq`*[
      _type == "${TAG_DOCUMENT_NAME}"
      && name.current in $tagNames
      && !(_id in path("drafts.**"))
    ]{ _id, name }`,
    {tagNames}
  )

  if (!resolvedTags?.length) return []

  return resolvedTags.map(tag => ({
    id: tag._id,
    name: tag.name.current,
    facetInput: tagFacetInput
  }))
}
