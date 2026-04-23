import type {SanityClient} from '@sanity/client'
import groq from 'groq'
import {nanoid} from 'nanoid'
import {TAG_DOCUMENT_NAME} from '../constants'
import type {Tag} from '../types'

type ApplyMediaTagsOptions = {
  client: SanityClient
  assetId: string
  mediaTags: string[]
  createTagsOnUpload?: boolean
}

/**
 * Applies media tags to an asset document.
 * Finds existing tags by name or creates new ones if createTagsOnUpload is true.
 * Then patches the asset to add weak references to the tags.
 */
export async function applyMediaTags({
  client,
  assetId,
  mediaTags,
  createTagsOnUpload = true
}: ApplyMediaTagsOptions): Promise<void> {
  if (!mediaTags || mediaTags.length === 0) {
    return
  }

  // Resolve all tags - find existing or create new ones
  const resolvedTags = await Promise.all(
    mediaTags.map(async tagName => {
      // Try to find existing tag
      const existingTag = await client.fetch<Tag | null>(
        groq`*[_type == "${TAG_DOCUMENT_NAME}" && name.current == $tagName][0]`,
        {tagName}
      )

      if (existingTag) {
        return existingTag
      }

      // If createTagsOnUpload is enabled, create the tag
      if (createTagsOnUpload) {
        const newTag = await client.create({
          _type: TAG_DOCUMENT_NAME,
          name: {
            _type: 'slug',
            current: tagName
          }
        })
        return newTag as Tag
      }

      // Otherwise, skip this tag
      return null
    })
  )

  // Filter out null values (tags that weren't created)
  const validTags = resolvedTags.filter((tag): tag is Tag => tag !== null)

  // If no valid tags, nothing to do
  if (validTags.length === 0) {
    return
  }

  // Build tag references array
  const tagReferences = validTags.map(tag => ({
    _key: nanoid(),
    _ref: tag._id,
    _type: 'reference' as const,
    _weak: true
  }))

  // Patch the asset to add tags
  await client
    .patch(assetId)
    .setIfMissing({opt: {}})
    .setIfMissing({'opt.media': {}})
    .setIfMissing({'opt.media.tags': []})
    .append('opt.media.tags', tagReferences)
    .commit()
}
