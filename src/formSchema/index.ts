import * as z from 'zod'

export const tagOptionSchema = z.object({
  label: z.string().trim().min(1, {message: 'Label cannot be empty'}),
  value: z.string().trim().min(1, {message: 'Value cannot be empty'})
})

export const assetFormSchema = z.object({
  altText: z.string().trim().optional(),
  creditLine: z.string().trim().optional(),
  description: z.string().trim().optional(),
  opt: z.object({
    media: z.object({
      tags: z.array(tagOptionSchema).nullable()
    })
  }),
  originalFilename: z.string().trim().min(1, {message: 'Filename cannot be empty'}),
  title: z.string().trim().optional()
})

export const tagFormSchema = z.object({
  name: z.string().min(1, {message: 'Name cannot be empty'})
})
