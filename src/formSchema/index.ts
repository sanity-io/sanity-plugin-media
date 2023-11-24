import * as z from 'zod'

export const tagOptionSchema = z.object({
  label: z.string().trim().min(1, {message: 'Label cannot be empty'}),
  value: z.string().trim().min(1, {message: 'Value cannot be empty'})
})

export const generalOptionSchema = z.object({
  label: z.string().trim().min(1, {message: 'Label cannot be empty'}),
  value: z.string().trim().min(1, {message: 'Value cannot be empty'})
})

export const assetFormSchema = z.object({
  name: z.string().trim(),
  season: z
    .object({
      label: z.string().trim(),
      value: z.string().trim()
    })
    .nullable(),
  collaboration: z
    .object({
      label: z.string().trim(),
      value: z.string().trim()
    })
    .nullable(),
  products: z
    .array(
      z.object({
        _key: z.string(),
        id: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        published: z.boolean()
      })
    )
    .optional(),
  primaryProducts: z
    .array(
      z.object({
        _key: z.string(),
        id: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        published: z.boolean()
      })
    )
    .optional(),
  secondaryProducts: z
    .array(
      z.object({
        _key: z.string(),
        id: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        published: z.boolean()
      })
    )
    .optional(),
  altText: z.string().trim().optional(),
  description: z.string().trim().optional(),
  opt: z.object({
    media: z.object({
      tags: z.array(tagOptionSchema).nullable()
    })
  }),
  title: z.string().trim().optional()
})

export const massEditAssetsFormSchema = z.object({
  name: z.string().trim(),
  season: z
    .object({
      label: z.string().trim().min(1, {message: 'Label cannot be empty'}),
      value: z.string().trim().min(1, {message: 'Value cannot be empty'})
    })
    .nullable(),
  collaboration: z
    .object({
      label: z.string().trim().min(1, {message: 'Label cannot be empty'}),
      value: z.string().trim().min(1, {message: 'Value cannot be empty'})
    })
    .nullable(),
  products: z
    .array(
      z.object({
        _key: z.string(),
        id: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        published: z.boolean()
      })
    )
    .optional(),
  primaryProducts: z
    .array(
      z.object({
        _key: z.string(),
        id: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        published: z.boolean()
      })
    )
    .optional(),
  secondaryProducts: z
    .array(
      z.object({
        _key: z.string(),
        id: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        published: z.boolean()
      })
    )
    .optional(),
  altText: z.string().trim().optional(),
  description: z.string().trim().optional(),
  opt: z.object({
    media: z.object({
      tags: z.array(tagOptionSchema).nullable()
    })
  }),
  title: z.string().trim().optional()
})

export const tagFormSchema = z.object({
  name: z.string().min(1, {message: 'Name cannot be empty'})
})

export const seasonFormSchema = z.object({
  name: z.string().min(1, {message: 'Name cannot be empty'})
})

export const collaborationFormSchema = z.object({
  name: z.string().min(1, {message: 'Name cannot be empty'})
})
