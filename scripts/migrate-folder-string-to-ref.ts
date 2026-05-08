/* eslint-env node */
/* eslint-disable no-process-exit */
/**
 * Migration: Convert legacy path-string folders to reference-based folders.
 *
 * Background
 * ----------
 * Earlier versions of the folder support stored `opt.media.folder` on assets
 * as a path string (e.g. `"products/hero/cat"`) and used the same string as
 * the identity of `media.folder` documents. From this release onward, folders
 * are real document references: each `media.folder` doc holds `name` plus a
 * `parent` reference to another folder (null for root), and assets store
 * `opt.media.folder` as a single weak reference to a folder document.
 *
 * This script:
 *   1. Reads all existing `media.folder` docs (with their `path` strings)
 *      and all assets with a `defined(opt.media.folder)` string.
 *   2. Materializes a folder document for every distinct path segment,
 *      creating intermediate ancestors as needed and stamping their
 *      `name` + `parent` ref. Existing folder docs keep their `_id`.
 *   3. Replaces every asset's `opt.media.folder` string with a weak
 *      reference to the corresponding folder doc.
 *   4. Unsets the legacy `path` field on each `media.folder` doc.
 *
 * Idempotent: re-running on an already-migrated dataset is a no-op (no
 * string-typed `opt.media.folder` left, no `path` field on folder docs).
 *
 * Usage
 * -----
 *     npx sanity@latest exec scripts/migrate-folder-string-to-ref.ts \
 *       --with-user-token \
 *       --project <projectId> --dataset <dataset>
 *
 * The script uses the Sanity client from the Studio context (so any auth
 * configured via `sanity login` / SANITY_AUTH_TOKEN env is respected).
 *
 * Run a dry pass first by setting DRY_RUN below to `true`.
 */

import {createClient, type SanityClient} from '@sanity/client'

const DRY_RUN = false
const CHUNK_SIZE = 100

type LegacyFolderDoc = {_id: string; path?: string}
type LegacyAssetRef = {_id: string; folder: string}

const FOLDER_DOCUMENT_NAME = 'media.folder'

const normalizePath = (path: string) =>
  path
    .split('/')
    .map(segment => segment.trim())
    .filter(Boolean)
    .join('/')

async function chunkedCommit(
  client: SanityClient,
  mutations: Array<(tx: ReturnType<SanityClient['transaction']>) => void>
) {
  for (let i = 0; i < mutations.length; i += CHUNK_SIZE) {
    const slice = mutations.slice(i, i + CHUNK_SIZE)
    const tx = client.transaction()
    slice.forEach(apply => apply(tx))
    if (DRY_RUN) {
      // eslint-disable-next-line no-console
      console.log(`[dry-run] would commit ${slice.length} mutations`)
    } else {
      await tx.commit({visibility: 'async'})
    }
  }
}

export default async function run() {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET
  const token = process.env.SANITY_AUTH_TOKEN

  if (!projectId || !dataset) {
    throw new Error('SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET must be set')
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false
  })

  // 1. Read existing state.
  const folders = await client.fetch<LegacyFolderDoc[]>(
    `*[_type == $type && !(_id in path("drafts.**"))]{_id, path}`,
    {type: FOLDER_DOCUMENT_NAME}
  )
  const assetRefs = await client.fetch<LegacyAssetRef[]>(
    `*[_type in ["sanity.imageAsset", "sanity.fileAsset"]
      && !(_id in path("drafts.**"))
      && defined(opt.media.folder)
      && string::startsWith(string(opt.media.folder), "")
      && !defined(opt.media.folder._ref)
    ]{_id, "folder": opt.media.folder}`
  )

  // 2. Build a map of normalized path -> folder _id, materializing missing
  //    ancestors. We prefer reusing an existing media.folder doc whose `path`
  //    matches the segment chain.
  const idByPath = new Map<string, string>()
  const pathById = new Map<string, string>()
  folders.forEach(f => {
    if (f.path) {
      const normalized = normalizePath(f.path)
      idByPath.set(normalized, f._id)
      pathById.set(f._id, normalized)
    }
  })

  const allPaths = new Set<string>()
  folders.forEach(f => {
    if (f.path) allPaths.add(normalizePath(f.path))
  })
  assetRefs.forEach(a => {
    if (typeof a.folder === 'string' && a.folder) {
      allPaths.add(normalizePath(a.folder))
    }
  })

  // Expand every path into all its ancestor prefixes so intermediates exist.
  const fullPathSet = new Set<string>()
  allPaths.forEach(p => {
    p.split('/').reduce((acc, segment) => {
      const next = acc ? `${acc}/${segment}` : segment
      fullPathSet.add(next)
      return next
    }, '')
  })

  // Materialize folder docs in a stable order (shortest path first so parents
  // exist before children).
  const sortedPaths = Array.from(fullPathSet).sort(
    (a, b) => a.length - b.length || a.localeCompare(b)
  )

  const createMutations: Array<(tx: ReturnType<SanityClient['transaction']>) => void> = []
  for (const path of sortedPaths) {
    if (idByPath.has(path)) continue
    const id = `${FOLDER_DOCUMENT_NAME}.${path
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .slice(0, 60)}-${Math.random().toString(36).slice(2, 8)}`
    idByPath.set(path, id)
    pathById.set(id, path)
    const segments = path.split('/')
    const name = segments[segments.length - 1]
    const parentPath = segments.slice(0, -1).join('/')
    const parentId = parentPath ? idByPath.get(parentPath) : undefined
    createMutations.push(tx =>
      tx.create({
        _id: id,
        _type: FOLDER_DOCUMENT_NAME,
        name,
        ...(parentId ? {parent: {_ref: parentId, _type: 'reference', _weak: true}} : {})
      } as Record<string, unknown>)
    )
  }

  // 3. For each existing folder doc that has only `path`, set `name` and
  //    `parent` and unset `path`.
  const folderPatchMutations: Array<(tx: ReturnType<SanityClient['transaction']>) => void> = []
  folders.forEach(f => {
    if (!f.path) return
    const normalized = normalizePath(f.path)
    const segments = normalized.split('/')
    const name = segments[segments.length - 1]
    const parentPath = segments.slice(0, -1).join('/')
    const parentId = parentPath ? idByPath.get(parentPath) : undefined
    folderPatchMutations.push(tx => {
      const patch = tx.patch(f._id).set({name}).unset(['path'])
      if (parentId) {
        patch.set({parent: {_ref: parentId, _type: 'reference', _weak: true}})
      } else {
        patch.unset(['parent'])
      }
    })
  })

  // 4. Replace asset folder strings with refs.
  const assetPatchMutations: Array<(tx: ReturnType<SanityClient['transaction']>) => void> = []
  assetRefs.forEach(a => {
    const normalized = normalizePath(a.folder)
    const targetId = idByPath.get(normalized)
    if (!targetId) {
      // eslint-disable-next-line no-console
      console.warn(`[skip] asset ${a._id} references unknown folder path "${a.folder}"`)
      return
    }
    assetPatchMutations.push(tx =>
      tx.patch(a._id).set({'opt.media.folder': {_ref: targetId, _type: 'reference', _weak: true}})
    )
  })

  // eslint-disable-next-line no-console
  console.log(
    `Folder migration plan: ${createMutations.length} new folder doc(s), ` +
      `${folderPatchMutations.length} folder doc(s) to patch, ` +
      `${assetPatchMutations.length} asset(s) to patch.`
  )

  await chunkedCommit(client, createMutations)
  await chunkedCommit(client, folderPatchMutations)
  await chunkedCommit(client, assetPatchMutations)

  // eslint-disable-next-line no-console
  console.log(DRY_RUN ? 'Dry run complete.' : 'Migration complete.')
}

run().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
