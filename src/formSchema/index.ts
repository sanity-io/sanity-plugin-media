import * as z from 'zod'

// Helper to generate localized string schema
export function localizedStringSchema(locales?: {id: string}[]) {
  if (!locales || locales.length === 0) {
    return z.string().trim().optional()
  }
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const locale of locales) {
    shape[locale.id] = z.string().trim().optional()
  }
  return z.object(shape)
}

export const tagOptionSchema = z.object({
  label: z.string().trim().min(1, {message: 'Label cannot be empty'}),
  value: z.string().trim().min(1, {message: 'Value cannot be empty'})
})

export function getAssetFormSchema(locales?: {id: string}[]) {
  return z.object({
    altText: localizedStringSchema(locales),
    creditLine: localizedStringSchema(locales),
    description: localizedStringSchema(locales),
    opt: z.object({
      media: z.object({
        tags: z.array(tagOptionSchema).nullable()
      })
    }),
    originalFilename: z.string().trim().min(1, {message: 'Filename cannot be empty'}),
    title: localizedStringSchema(locales)
  })
}

export const tagFormSchema = z.object({
  name: z.string().min(1, {message: 'Name cannot be empty'})
})
