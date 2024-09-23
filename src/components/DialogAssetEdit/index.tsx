import {zodResolver} from '@hookform/resolvers/zod'
import type {MutationEvent} from '@sanity/client'
import {Box, Button, Card, Flex, Stack, Tab, TabList, TabPanel, Text} from '@sanity/ui'
import {Asset, AssetFormData, DialogAssetEditProps, TagSelectOption} from '@types'
import groq from 'groq'
import {ReactNode, useCallback, useEffect, useRef, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {useColorScheme, useDocumentStore, WithReferringDocuments} from 'sanity'
import {assetFormSchema} from '../../formSchema'
import useTypedSelector from '../../hooks/useTypedSelector'
import useVersionedClient from '../../hooks/useVersionedClient'
import {assetsActions, selectAssetById} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {selectTagSelectOptions} from '../../modules/tags'
import {getUniqueDocuments} from '../../utils/getUniqueDocuments'
import imageDprUrl from '../../utils/imageDprUrl'
import sanitizeFormData from '../../utils/sanitizeFormData'
import {isFileAsset, isImageAsset, isPdfAsset} from '../../utils/typeGuards'
import AssetMetadata from '../AssetMetadata'
import Dialog from '../Dialog'
import DocumentList from '../DocumentList'
import FileAssetPreview from '../FileAssetPreview'
import FilePdf from '../FilePdf'
import FormFieldInputText from '../FormFieldInputText'
import FormFieldInputTextarea from '../FormFieldInputTextarea'
import FormFieldTags from '../FormFieldTags'
import FormSubmitButton from '../FormSubmitButton'
import Image from '../Image'

type Props = {
  children: ReactNode
  dialog: DialogAssetEditProps
}

const DialogAssetEdit = (props: Props) => {
  const {
    children,
    dialog: {assetId, id, lastCreatedTag, lastRemovedTagIds}
  } = props

  const client = useVersionedClient()
  const {scheme} = useColorScheme()

  const documentStore = useDocumentStore()

  const dispatch = useDispatch()
  const assetItem = useTypedSelector(state => selectAssetById(state, String(assetId))) // TODO: check casting

  const assetUpdatedPrev = useRef<string | undefined>(undefined)

  // Generate a snapshot of the current asset
  const [assetSnapshot, setAssetSnapshot] = useState(assetItem?.asset)
  const [tabSection, setTabSection] = useState<'details' | 'references'>('details')

  const currentAsset = assetItem ? assetItem?.asset : assetSnapshot

  const assetTagOptions = useTypedSelector(selectTagSelectOptions(currentAsset))
  const assetProjectOptions = useTypedSelector(selectTagSelectOptions(currentAsset, 'projects'))

  const generateDefaultValues = useCallback(
    (asset?: Asset): AssetFormData => {
      return {
        altText: asset?.altText || '',
        description: asset?.description || '',
        originalFilename: asset?.originalFilename || '',
        opt: {media: {tags: assetTagOptions, projects: assetProjectOptions}},
        title: asset?.title || ''
      }
    },
    [assetTagOptions]
  )

  const {
    control,
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isDirty, isValid},
    getValues,
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm<AssetFormData>({
    defaultValues: generateDefaultValues(assetItem?.asset),
    mode: 'onChange',
    resolver: zodResolver(assetFormSchema)
  })

  const formUpdating = !assetItem || assetItem?.updating

  const handleClose = useCallback(() => {
    dispatch(dialogActions.remove({id}))
  }, [dispatch, id])

  const handleDelete = useCallback(() => {
    if (!assetItem?.asset) {
      return
    }

    dispatch(
      dialogActions.showConfirmDeleteAssets({
        assets: [assetItem],
        closeDialogId: assetItem?.asset._id
      })
    )
  }, [assetItem, dispatch])

  const handleAssetUpdate = useCallback((update: MutationEvent) => {
    const {result, transition} = update
    if (result && transition === 'update') {
      // Regenerate asset snapshot
      setAssetSnapshot(result as Asset)
    }
  }, [])

  // Submit react-hook-form
  const onSubmit: SubmitHandler<AssetFormData> = useCallback(
    formData => {
      if (!assetItem?.asset) {
        return
      }

      const sanitizedFormData = sanitizeFormData(formData)

      dispatch(
        assetsActions.updateRequest({
          asset: assetItem?.asset,
          closeDialogId: assetItem?.asset._id,
          formData: {
            ...sanitizedFormData,
            // Map tags to sanity references
            opt: {
              media: {
                ...sanitizedFormData.opt.media,
                tags:
                  sanitizedFormData.opt.media.tags?.map((tag: TagSelectOption) => ({
                    _ref: tag.value,
                    _type: 'reference',
                    _weak: true
                  })) || null,
                projects:
                  sanitizedFormData.opt.media.projects?.map((tag: TagSelectOption) => ({
                    _ref: tag.value,
                    _type: 'reference',
                    _weak: true
                  })) || null,
                preview: assetItem?.asset?.opt?.media?.preview || null
              }
            }
          }
        })
      )
    },
    [assetItem?.asset, dispatch]
  )

  // Listen for asset mutations and update snapshot
  useEffect(() => {
    if (!assetItem?.asset) {
      return undefined
    }

    // Remember that Sanity listeners ignore joins, order clauses and projections
    const subscriptionAsset = client
      .listen(groq`*[_id == $id]`, {id: assetItem?.asset._id})
      .subscribe(handleAssetUpdate)

    return () => {
      subscriptionAsset?.unsubscribe()
    }
  }, [assetItem?.asset, client, handleAssetUpdate])

  // Update tags form field (react-select) when a new _inline_ tag has been created
  useEffect(() => {
    if (lastCreatedTag) {
      const name =
        lastCreatedTag?.type === 'media.project' ? 'opt.media.projects' : 'opt.media.tags'
      const existingTags = (getValues(name) as TagSelectOption[]) || []
      const updatedTags = existingTags.concat([lastCreatedTag])
      setValue(name, updatedTags, {shouldDirty: true})
    }
  }, [getValues, lastCreatedTag, setValue])

  // Update tags form field (react-select) when an _inline_ tag has been removed elsewhere
  useEffect(() => {
    const name = 'opt.media.tags'

    if (lastRemovedTagIds) {
      const existingTags = (getValues(name) as TagSelectOption[]) || []
      const updatedTags = existingTags.filter(tag => {
        return !lastRemovedTagIds.includes(tag.value)
      })

      setValue(name, updatedTags, {shouldDirty: true})
    }
  }, [getValues, lastRemovedTagIds, setValue])

  // Reset react-hook-form local state on mount and every time the asset has been updated elsewhere
  useEffect(() => {
    if (assetUpdatedPrev.current !== assetItem?.asset._updatedAt) {
      reset(generateDefaultValues(assetItem?.asset))
    }
    assetUpdatedPrev.current = assetItem?.asset._updatedAt
  }, [assetItem?.asset, generateDefaultValues, reset])

  const Footer = () => (
    <Box padding={3}>
      <Flex justify="space-between">
        {/* Delete button */}
        <Button
          disabled={formUpdating}
          fontSize={1}
          mode="bleed"
          onClick={handleDelete}
          text="Delete"
          tone="critical"
        />

        {/* Submit button */}
        <FormSubmitButton
          disabled={formUpdating || !isDirty || !isValid}
          isValid={isValid}
          lastUpdated={currentAsset?._updatedAt}
          onClick={handleSubmit(onSubmit)}
        />
      </Flex>
    </Box>
  )

  if (!currentAsset) {
    return null
  }

  return (
    <Dialog footer={<Footer />} header="Asset details" id={id} onClose={handleClose} width={3}>
      {/*
        We reverse direction to ensure the download button doesn't appear (in the DOM) before other tabbable items.
        This ensures that the dialog doesn't scroll down to the download button (which on smaller screens, can sometimes
        be below the fold).
      */}
      <Flex direction={['column-reverse', 'column-reverse', 'row-reverse']}>
        <Box flex={1} marginTop={[5, 5, 0]} padding={4}>
          <WithReferringDocuments documentStore={documentStore} id={currentAsset._id}>
            {({isLoading, referringDocuments}) => {
              const uniqueReferringDocuments = getUniqueDocuments(referringDocuments)
              return (
                <>
                  {/* Tabs */}
                  <TabList space={2}>
                    <Tab
                      aria-controls="details-panel"
                      disabled={formUpdating}
                      id="details-tab"
                      label="Details"
                      onClick={() => setTabSection('details')}
                      selected={tabSection === 'details'}
                      size={2}
                    />
                    <Tab
                      aria-controls="references-panel"
                      disabled={formUpdating}
                      id="references-tab"
                      label={`References${
                        !isLoading && Array.isArray(uniqueReferringDocuments)
                          ? ` (${uniqueReferringDocuments.length})`
                          : ''
                      }`}
                      onClick={() => setTabSection('references')}
                      selected={tabSection === 'references'}
                      size={2}
                    />
                  </TabList>

                  {/* Form fields */}
                  <Box as="form" marginTop={4} onSubmit={handleSubmit(onSubmit)}>
                    {/* Deleted notification */}
                    {!assetItem && (
                      <Card marginBottom={3} padding={3} radius={2} shadow={1} tone="critical">
                        <Text size={1}>This file cannot be found – it may have been deleted.</Text>
                      </Card>
                    )}

                    {/* Hidden button to enable enter key submissions */}
                    <button style={{display: 'none'}} tabIndex={-1} type="submit" />

                    {/* Panel: details */}
                    <TabPanel
                      aria-labelledby="details"
                      hidden={tabSection !== 'details'}
                      id="details-panel"
                    >
                      <Stack space={3}>
                        {/* Tags */}
                        <FormFieldTags
                          control={control}
                          disabled={formUpdating}
                          assetSnapshot={assetSnapshot}
                          assetId={assetId}
                          error={errors?.opt?.media?.tags?.message}
                          label="Tags"
                          placeholder="Select or create..."
                          noOptionsMessage="No tags"
                          name="opt.media.tags"
                          type="media.tag"
                          zIndex={3}
                        />
                        <FormFieldTags
                          control={control}
                          disabled={formUpdating}
                          assetSnapshot={assetSnapshot}
                          assetId={assetId}
                          error={errors?.opt?.media?.projects?.message}
                          label="Projects"
                          placeholder="Select or create..."
                          noOptionsMessage="No projects"
                          name="opt.media.projects"
                          type="media.project"
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
                      </Stack>
                    </TabPanel>

                    {/* Panel: References */}
                    <TabPanel
                      aria-labelledby="references"
                      hidden={tabSection !== 'references'}
                      id="references-panel"
                    >
                      <Box marginTop={5}>
                        {assetItem?.asset && (
                          <DocumentList
                            documents={uniqueReferringDocuments}
                            isLoading={isLoading}
                          />
                        )}
                      </Box>
                    </TabPanel>
                  </Box>
                </>
              )
            }}
          </WithReferringDocuments>
        </Box>

        <Box flex={1} padding={4}>
          <Box style={{aspectRatio: '1'}}>
            {/* File pdf */}
            {isPdfAsset(currentAsset) && <FilePdf url={currentAsset.url} />}

            {/* File */}
            {isFileAsset(currentAsset) && <FileAssetPreview asset={currentAsset} />}

            {/* Image */}
            {isImageAsset(currentAsset) && (
              <Image
                draggable={false}
                scheme={scheme}
                showCheckerboard={!currentAsset?.metadata?.isOpaque}
                src={imageDprUrl(currentAsset, {height: 600, width: 600})}
              />
            )}
          </Box>

          {/* Metadata */}
          {currentAsset && (
            <Box marginTop={4}>
              <AssetMetadata asset={currentAsset} item={assetItem} />
            </Box>
          )}
        </Box>
      </Flex>

      {children}
    </Dialog>
  )
}

export default DialogAssetEdit
