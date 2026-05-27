import {Box, Button, Card, Flex, Stack, Tab, TabList, TabPanel, Text} from '@sanity/ui'
import {useState} from 'react'
import {type Control, type FieldErrors, type UseFormRegister} from 'react-hook-form'
import type {Asset, AssetFormData, Locale, TagSelectOption} from '../../types'
import FormFieldInputTags from '../FormFieldInputTags'
import FormFieldInputLabel from '../FormFieldInputLabel'
import FormFieldInputText from '../FormFieldInputText'
import FormFieldInputTextarea from '../FormFieldInputTextarea'
import {FolderIcon} from '@sanity/icons'

type LocalizedErrors = Record<string, {message?: string} | undefined>

// When locales are not configured, extract a plain string from a potentially localized field
function toStringField(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    const found = Object.values(value as Record<string, string>).find(v => v)
    return found || undefined
  }
  return undefined
}

function truncateFolderPath(path?: string): string | undefined {
  const segments = path?.split('/').filter(Boolean)
  if (!segments || segments.length <= 3) return path
  return [segments[0], '...', ...segments.slice(-2)].join('/')
}

export type DetailsProps = {
  formUpdating: boolean
  handleCreateTag: (title: string) => void
  control: Control<AssetFormData>
  errors: FieldErrors<AssetFormData>
  register: UseFormRegister<AssetFormData>
  allTagOptions: TagSelectOption[]
  assetTagOptions: TagSelectOption[] | null
  currentAsset: Asset
  folderPath?: string
  folderMissing?: boolean
  onChangeFolder: () => void
  creditLine?: {
    enabled: boolean
    excludeSources?: string | string[] | undefined
  }
  locales?: Locale[]
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
  folderPath,
  folderMissing,
  onChangeFolder,
  creditLine,
  locales
}: DetailsProps) {
  const hasLocales = locales && locales.length > 0
  const [activeLocaleTab, setActiveLocaleTab] = useState(0)
  const folderId = currentAsset?.opt?.media?.folder?._ref
  const folderLabel =
    truncateFolderPath(folderPath) || (folderMissing ? 'Folder no longer exists' : 'No folder')

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
      {/* Folder */}
      <Box>
        <FormFieldInputLabel label="Folder" name="folder" />
        <Card border padding={2} radius={2}>
          <Flex align="center" gap={3} justify="space-between">
            <Flex
              align="center"
              gap={2}
              flex={1}
              style={{minWidth: 0, overflowX: 'auto', whiteSpace: 'nowrap', overflowY: 'hidden'}}
            >
              <FolderIcon />
              <Text muted={!folderId} size={1}>
                {folderLabel}
              </Text>
            </Flex>
            <Button
              padding={2}
              disabled={formUpdating}
              fontSize={1}
              mode="ghost"
              onClick={onChangeFolder}
              text={folderId ? 'Change folder' : 'Add to folder'}
              type="button"
            />
          </Flex>
        </Card>
      </Box>
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
                    error={(errors?.title as LocalizedErrors)?.[locale.id]?.message}
                    label="Title"
                    name={`title.${locale.id}`}
                  />
                  <FormFieldInputText
                    {...register(`altText.${locale.id}` as const)}
                    disabled={formUpdating}
                    error={(errors?.altText as LocalizedErrors)?.[locale.id]?.message}
                    label="Alt Text"
                    name={`altText.${locale.id}`}
                  />
                  <FormFieldInputTextarea
                    {...register(`description.${locale.id}` as const)}
                    disabled={formUpdating}
                    error={(errors?.description as LocalizedErrors)?.[locale.id]?.message}
                    label="Description"
                    name={`description.${locale.id}`}
                    rows={5}
                  />
                  {creditLine?.enabled && (
                    <FormFieldInputText
                      {...register(`creditLine.${locale.id}` as const)}
                      error={(errors?.creditLine as LocalizedErrors)?.[locale.id]?.message}
                      label="Credit"
                      name={`creditLine.${locale.id}`}
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
            value={toStringField(currentAsset?.title)}
          />
          <FormFieldInputText
            {...register('altText')}
            disabled={formUpdating}
            error={errors?.altText?.message}
            label="Alt Text"
            name="altText"
            value={toStringField(currentAsset?.altText)}
          />
          <FormFieldInputTextarea
            {...register('description')}
            disabled={formUpdating}
            error={errors?.description?.message}
            label="Description"
            name="description"
            rows={5}
            value={toStringField(currentAsset?.description)}
          />
          {creditLine?.enabled && (
            <FormFieldInputText
              {...register('creditLine')}
              error={errors?.creditLine?.message}
              label="Credit"
              name="creditLine"
              value={toStringField(currentAsset?.creditLine)}
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
