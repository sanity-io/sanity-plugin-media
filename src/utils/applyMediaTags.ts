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

// Serialize calls per asset so concurrent fields reading the same asset
// don't race each other — the second call always runs after the first commits.
const pendingByAsset = new Map<string, Promise<void>>()

export function applyMediaTags(options: ApplyMediaTagsOptions): Promise<void> {
  const {assetId} = options
  const chain = (pendingByAsset.get(assetId) ?? Promise.resolve()).then(() =>
    doApplyMediaTags(options)
  )
  const cleanup = chain.catch(() => {}).finally(() => {
    if (pendingByAsset.get(assetId) === cleanup) pendingByAsset.delete(assetId)
  })
  pendingByAsset.set(assetId, cleanup)
  return chain
}

async function doApplyMediaTags({
  client,
  assetId,
  mediaTags,
  createTagsOnUpload = true
}: ApplyMediaTagsOptions): Promise<void> {
  if (!mediaTags || mediaTags.length === 0) return

  const resolvedTags = await Promise.all(
    mediaTags.map(async tagName => {
      const existingTag = await client.fetch<Tag | null>(
        groq`*[_type == "${TAG_DOCUMENT_NAME}" && name.current == $tagName][0]`,
        {tagName}
      )
      if (existingTag) return existingTag
      if (createTagsOnUpload) {
        const newTag = await client.create({
          _type: TAG_DOCUMENT_NAME,
          name: {_type: 'slug', current: tagName}
        })
        return newTag as Tag
      }
      return null
    })
  )

  const validTags = resolvedTags.filter((tag): tag is Tag => tag !== null)
  if (validTags.length === 0) return

  const existing = await client.fetch<{tagIds: string[]} | null>(
    groq`*[_id == $assetId][0]{'tagIds': opt.media.tags[]._ref}`,
    {assetId},
    {useCdn: false} // bypass CDN cache so we see the latest committed tag refs
  )
  const existingIds = new Set(existing?.tagIds ?? [])

  const tagReferences = validTags
    .filter(tag => !existingIds.has(tag._id))
    .map(tag => ({
      _key: nanoid(),
      _ref: tag._id,
      _type: 'reference' as const,
      _weak: true
    }))

  if (tagReferences.length === 0) return

  await client
    .patch(assetId)
    .setIfMissing({opt: {}})
    .setIfMissing({'opt.media': {}})
    .setIfMissing({'opt.media.tags': []})
    .append('opt.media.tags', tagReferences)
    .commit()
}
