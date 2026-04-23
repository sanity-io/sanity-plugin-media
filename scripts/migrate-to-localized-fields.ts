/**
 * Migration: Convert flat string asset fields to localized object format.
 *
 * Run with:
 *   npx sanity@latest migration run scripts/migrate-to-localized-fields.ts \
 *     --project <projectId> --dataset <dataset>
 *
 * See: https://www.sanity.io/docs/content-lake/content-migration-cheatsheet
 *
 * Before running, set DEFAULT_LOCALE_ID to the locale id that existing
 * string values should be mapped to.
 */

import {defineMigration, patch} from 'sanity/migrate'

const DEFAULT_LOCALE_ID = 'en' // Change to your default locale id

const LOCALIZED_FIELDS = ['title', 'altText', 'description', 'creditLine'] as const
const ASSET_TYPES = ['sanity.imageAsset', 'sanity.fileAsset'] as const

export default defineMigration({
  title: 'Convert flat asset fields to localized object format',
  filter: `_type in ${JSON.stringify(ASSET_TYPES)}`,

  migrate: {
    document(doc) {
      const ops = []

      for (const field of LOCALIZED_FIELDS) {
        const value = (doc as Record<string, unknown>)[field]

        if (typeof value === 'string') {
          // Convert string → {[defaultLocale]: string}
          ops.push(patch(doc._id, [{set: {[field]: {[DEFAULT_LOCALE_ID]: value}}}]))
        } else if (value === null || value === undefined) {
          // Leave missing fields alone
        }
        // Already an object — already migrated, skip
      }

      return ops
    }
  }
})
