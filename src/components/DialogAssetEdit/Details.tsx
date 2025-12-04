import {Stack} from '@sanity/ui'
import type {Asset, AssetFormData, TagSelectOption} from '../../types'
import {type Control, type FieldErrors, type UseFormRegister} from 'react-hook-form'

import FormFieldInputTags from '../FormFieldInputTags'
import FormFieldInputText from '../FormFieldInputText'
import FormFieldInputTextarea from '../FormFieldInputTextarea'

export type DetailsProps = {
  formUpdating: boolean
  handleCreateTag: (title: string) => void
  control: Control<AssetFormData>
  errors: FieldErrors<AssetFormData>
  register: UseFormRegister<AssetFormData>
  allTagOptions: TagSelectOption[]
  assetTagOptions: TagSelectOption[] | null
  currentAsset: Asset
  creditLine?: {
    enabled: boolean
    excludeSources?: string | string[] | undefined
  }
}

export default function Details({
  formUpdating,
  handleCreateTag,
  control,
  errors,
  register,
  allTagOptions,
  assetTagOptions,
  currentAsset,
  creditLine
}: DetailsProps) {
  return (
    <Stack space={3}>
      {/* Tags */}
      <FormFieldInputTags
        control={control}
        disabled={formUpdating}
        error={errors?.opt?.media?.tags?.message}
        label="Tags"
        name="opt.media.tags"
        onCreateTag={handleCreateTag}
        options={allTagOptions}
        placeholder="Select or create..."
        value={assetTagOptions}
      />
      {/* Filename */}
      <FormFieldInputText
        {...register('originalFilename')}
        disabled={formUpdating}
        error={errors?.originalFilename?.message}
        label="Filename"
        name="originalFilename"
        value={currentAsset?.originalFilename}
      />
      {/* Title */}
      <FormFieldInputText
        {...register('title')}
        disabled={formUpdating}
        error={errors?.title?.message}
        label="Title"
        name="title"
        value={currentAsset?.title}
      />
      {/* Alt text */}
      <FormFieldInputText
        {...register('altText')}
        disabled={formUpdating}
        error={errors?.altText?.message}
        label="Alt Text"
        name="altText"
        value={currentAsset?.altText}
      />
      {/* Description */}
      <FormFieldInputTextarea
        {...register('description')}
        disabled={formUpdating}
        error={errors?.description?.message}
        label="Description"
        name="description"
        rows={5}
        value={currentAsset?.description}
      />
      {/* CreditLine */}
      {creditLine?.enabled && (
        <FormFieldInputText
          {...register('creditLine')}
          error={errors?.creditLine?.message}
          label="Credit"
          name="creditLine"
          value={currentAsset?.creditLine}
          disabled={
            formUpdating || creditLine?.excludeSources?.includes(currentAsset?.source?.name)
          }
        />
      )}
    </Stack>
  )
}
