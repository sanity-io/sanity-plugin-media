import {Card, Stack, Tab, TabList, TabPanel} from '@sanity/ui'
import {useState} from 'react'
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
  const [activeLocaleTab, setActiveLocaleTab] = useState(0)
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
      {/* Localized fields grouped by language */}
      {hasLocales ? (
        <Card marginTop={2} shadow={1} padding={3} radius={1}>
          <Stack space={2}>
            <TabList space={2}>
              {locales.map((locale, idx) => (
                <Tab
                  key={locale.id}
                  id={`locale-tab-${locale.id}`}
                  aria-controls={`locale-panel-${locale.id}`}
                  selected={activeLocaleTab === idx}
                  onClick={() => setActiveLocaleTab(idx)}
                  label={locale.title}
                />
              ))}
            </TabList>
            {locales.map((locale, idx) => (
              <TabPanel
                key={locale.id}
                id={`locale-panel-${locale.id}`}
                aria-labelledby={`locale-tab-${locale.id}`}
                hidden={activeLocaleTab !== idx}
              >
                <Stack space={3}>
                  <FormFieldInputText
                    {...register(`title.${locale.id}` as const)}
                    disabled={formUpdating}
                    error={errors?.title?.[locale.id]?.message}
                    label="Title"
                    name={`title.${locale.id}`}
                    value={currentAsset?.title?.[locale.id]}
                  />
                  <FormFieldInputText
                    {...register(`altText.${locale.id}` as const)}
                    disabled={formUpdating}
                    error={errors?.altText?.[locale.id]?.message}
                    label="Alt Text"
                    name={`altText.${locale.id}`}
                    value={currentAsset?.altText?.[locale.id]}
                  />
                  <FormFieldInputTextarea
                    {...register(`description.${locale.id}` as const)}
                    disabled={formUpdating}
                    error={errors?.description?.[locale.id]?.message}
                    label="Description"
                    name={`description.${locale.id}`}
                    rows={5}
                    value={currentAsset?.description?.[locale.id]}
                  />
                  {creditLine?.enabled && (
                    <FormFieldInputText
                      {...register(`creditLine.${locale.id}` as const)}
                      error={errors?.creditLine?.[locale.id]?.message}
                      label="Credit"
                      name={`creditLine.${locale.id}`}
                      value={currentAsset?.creditLine?.[locale.id]}
                      disabled={
                        formUpdating ||
                        creditLine?.excludeSources?.includes(currentAsset?.source?.name)
                      }
                    />
                  )}
                </Stack>
              </TabPanel>
            ))}
          </Stack>
        </Card>
      ) : (
        <>
          <FormFieldInputText
            {...register('title')}
            disabled={formUpdating}
            error={errors?.title?.message}
            label="Title"
            name="title"
            value={currentAsset?.title}
          />
          <FormFieldInputText
            {...register('altText')}
            disabled={formUpdating}
            error={errors?.altText?.message}
            label="Alt Text"
            name="altText"
            value={currentAsset?.altText}
          />
          <FormFieldInputTextarea
            {...register('description')}
            disabled={formUpdating}
            error={errors?.description?.message}
            label="Description"
            name="description"
            rows={5}
            value={currentAsset?.description}
          />
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
        </>
      )}
    </Stack>
  )
}
