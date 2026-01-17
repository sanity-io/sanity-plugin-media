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
  locales?: {id: string; title: string}[]
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
  creditLine,
  locales
}: DetailsProps) {
  const hasLocales = locales && locales.length > 0
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
      {hasLocales ? (
        locales.map(locale => (
          <FormFieldInputText
            key={locale.id}
            {...register(`title.${locale.id}` as const)}
            disabled={formUpdating}
            error={errors?.title?.[locale.id]?.message}
            label={`Title (${locale.title})`}
            name={`title.${locale.id}`}
            value={currentAsset?.title?.[locale.id]}
          />
        ))
      ) : (
        <FormFieldInputText
          {...register('title')}
          disabled={formUpdating}
          error={errors?.title?.message}
          label="Title"
          name="title"
          value={currentAsset?.title}
        />
      )}
      {/* Alt text */}
      {hasLocales ? (
        locales.map(locale => (
          <FormFieldInputText
            key={locale.id}
            {...register(`altText.${locale.id}` as const)}
            disabled={formUpdating}
            error={errors?.altText?.[locale.id]?.message}
            label={`Alt Text (${locale.title})`}
            name={`altText.${locale.id}`}
            value={currentAsset?.altText?.[locale.id]}
          />
        ))
      ) : (
        <FormFieldInputText
          {...register('altText')}
          disabled={formUpdating}
          error={errors?.altText?.message}
          label="Alt Text"
          name="altText"
          value={currentAsset?.altText}
        />
      )}
      {/* Description */}
      {hasLocales ? (
        locales.map(locale => (
          <FormFieldInputTextarea
            key={locale.id}
            {...register(`description.${locale.id}` as const)}
            disabled={formUpdating}
            error={errors?.description?.[locale.id]?.message}
            label={`Description (${locale.title})`}
            name={`description.${locale.id}`}
            rows={5}
            value={currentAsset?.description?.[locale.id]}
          />
        ))
      ) : (
        <FormFieldInputTextarea
          {...register('description')}
          disabled={formUpdating}
          error={errors?.description?.message}
          label="Description"
          name="description"
          rows={5}
          value={currentAsset?.description}
        />
      )}
      {/* CreditLine */}
      {creditLine?.enabled &&
        (hasLocales ? (
          locales.map(locale => (
            <FormFieldInputText
              key={locale.id}
              {...register(`creditLine.${locale.id}` as const)}
              error={errors?.creditLine?.[locale.id]?.message}
              label={`Credit (${locale.title})`}
              name={`creditLine.${locale.id}`}
              value={currentAsset?.creditLine?.[locale.id]}
              disabled={
                formUpdating || creditLine?.excludeSources?.includes(currentAsset?.source?.name)
              }
            />
          ))
        ) : (
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
        ))}
    </Stack>
  )
}
