import {yupResolver} from '@hookform/resolvers/yup'
import type {MutationEvent} from '@sanity/client'
import {Box, Button, Card, Flex, Stack, Tab, TabList, TabPanel, Text} from '@sanity/ui'
import {Asset, DialogAssetEditProps, ReactSelectOption} from '@types'
import groq from 'groq'
import React, {ReactNode, useEffect, useRef, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import * as yup from 'yup'
import useTypedSelector from '../../hooks/useTypedSelector'
import useVersionedClient from '../../hooks/useVersionedClient'
import {assetsActions, selectAssetById} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {selectTags, selectTagSelectOptions, tagsActions} from '../../modules/tags'
import getTagSelectOptions from '../../utils/getTagSelectOptions'
import imageDprUrl from '../../utils/imageDprUrl'
import sanitizeFormData from '../../utils/sanitizeFormData'
import {isFileAsset, isImageAsset} from '../../utils/typeGuards'
import AssetMetadata from '../AssetMetadata'
import Dialog from '../Dialog'
import DocumentList from '../DocumentList'
import FileAssetPreview from '../FileAssetPreview'
import FormFieldInputTags from '../FormFieldInputTags'
import FormFieldInputText from '../FormFieldInputText'
import FormFieldInputTextarea from '../FormFieldInputTextarea'
import FormSubmitButton from '../FormSubmitButton'
import Image from '../Image'

type Props = {
  children: ReactNode
  dialog: DialogAssetEditProps
}

type FormData = yup.InferType<typeof formSchema>

const formSchema = yup.object().shape({
  originalFilename: yup.string().trim().required('Filename cannot be empty')
})

const DialogAssetEdit = (props: Props) => {
  const {
    children,
    dialog: {assetId, id, lastCreatedTag, lastRemovedTagIds}
  } = props

  const client = useVersionedClient()

  // Redux
  const dispatch = useDispatch()
  const assetItem = useTypedSelector(state => selectAssetById(state, String(assetId))) // TODO: check casting
  const tags = useTypedSelector(selectTags)

  // Refs
  const isMounted = useRef(false)

  // State
  // - Generate a snapshot of the current asset
  const [assetSnapshot, setAssetSnapshot] = useState(assetItem?.asset)
  const [tabSection, setTabSection] = useState<'details' | 'references'>('details')

  const currentAsset = assetItem ? assetItem?.asset : assetSnapshot
  const allTagOptions = getTagSelectOptions(tags)

  // Redux
  const assetTagOptions = useTypedSelector(selectTagSelectOptions(currentAsset))

  const generateDefaultValues = (asset?: Asset) => ({
    altText: asset?.altText || '',
    description: asset?.description || '',
    originalFilename: asset?.originalFilename || '',
    opt: {media: {tags: assetTagOptions}},
    title: asset?.title || ''
  })

  // Generate a string from all current tag labels
  // This is used purely to determine tag updates to then update the form in real time
  const currentTagLabels = assetTagOptions?.map(tag => tag.label).join(',')

  // react-hook-form
  const {
    control,
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isDirty, isValid},
    getValues,
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm({
    defaultValues: generateDefaultValues(assetItem?.asset),
    mode: 'onChange',
    resolver: yupResolver(formSchema)
  })

  const formUpdating = !assetItem || assetItem?.updating

  // Callbacks
  const handleClose = () => {
    dispatch(dialogActions.remove({id}))
  }

  const handleDelete = () => {
    if (!assetItem?.asset) {
      return
    }

    dispatch(
      dialogActions.showConfirmDeleteAssets({
        assets: [assetItem],
        closeDialogId: assetItem?.asset._id
      })
    )
  }

  const handleAssetUpdate = (update: MutationEvent) => {
    const {result, transition} = update

    if (result && transition === 'update') {
      // Regenerate asset snapshot
      setAssetSnapshot(result as Asset)

      // Reset react-hook-form
      reset(generateDefaultValues(result as Asset))
    }
  }

  const handleCreateTag = (tagName: string) => {
    // Dispatch action to create new tag
    dispatch(
      tagsActions.createRequest({
        assetId: currentAsset?._id,
        name: tagName
      })
    )
  }

  // - submit react-hook-form
  const onSubmit = async (formData: FormData) => {
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
                sanitizedFormData.opt.media.tags?.map((tag: ReactSelectOption) => ({
                  _ref: tag.value,
                  _type: 'reference',
                  _weak: true
                })) || null
            }
          }
        }
      })
    )
  }

  // Effects
  // - Listen for asset mutations and update snapshot
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
  }, [])

  // - Partially reset form when current tags have changed (and after initial mount)
  useEffect(() => {
    if (isMounted.current) {
      reset(
        {
          opt: {
            media: {tags: assetTagOptions}
          }
        },
        {
          errors: true,
          dirtyFields: true,
          isDirty: true
        }
      )
    }

    // Mark as mounted
    isMounted.current = true
  }, [currentTagLabels])

  // - Update tags form field (react-select) when a new _inline_ tag has been created
  useEffect(() => {
    if (lastCreatedTag) {
      const existingTags = (getValues('opt.media.tags') as ReactSelectOption[]) || []
      const updatedTags = existingTags.concat([lastCreatedTag])
      setValue('opt.media.tags', updatedTags, {shouldDirty: true})
    }
  }, [lastCreatedTag])

  // - Update tags form field (react-select) when an _inline_ tag has been removed elsewhere
  useEffect(() => {
    if (lastRemovedTagIds) {
      const existingTags = (getValues('opt.media.tags') as ReactSelectOption[]) || []
      const updatedTags = existingTags.filter(tag => {
        return !lastRemovedTagIds.includes(tag.value)
      })

      setValue('opt.media.tags', updatedTags, {shouldDirty: true})
    }
  }, [lastRemovedTagIds])

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
          lastUpdated={currentAsset._updatedAt}
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
              label="References"
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
                <FormFieldInputTags
                  control={control}
                  disabled={formUpdating}
                  error={errors?.opt?.media?.tags}
                  label="Tags"
                  name="opt.media.tags"
                  onCreateTag={handleCreateTag}
                  options={allTagOptions}
                  placeholder="Select or create..."
                  value={assetTagOptions}
                />
                {/* Filename */}
                <FormFieldInputText
                  disabled={formUpdating}
                  error={errors?.originalFilename}
                  label="Filename"
                  name="originalFilename"
                  ref={register}
                  value={currentAsset?.originalFilename}
                />
                {/* Title */}
                <FormFieldInputText
                  disabled={formUpdating}
                  error={errors?.title}
                  label="Title"
                  name="title"
                  ref={register}
                  value={currentAsset?.title}
                />
                {/* Alt text */}
                <FormFieldInputText
                  disabled={formUpdating}
                  error={errors?.altText}
                  label="Alt Text"
                  name="altText"
                  ref={register}
                  value={currentAsset?.altText}
                />
                {/* Description */}
                <FormFieldInputTextarea
                  disabled={formUpdating}
                  error={errors?.description}
                  label="Description"
                  name="description"
                  ref={register}
                  rows={3}
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
                {assetItem?.asset && <DocumentList assetId={assetItem?.asset._id} />}
              </Box>
            </TabPanel>
          </Box>
        </Box>

        <Box flex={1} padding={4}>
          <Box style={{aspectRatio: '1'}}>
            {/* File */}
            {isFileAsset(currentAsset) && <FileAssetPreview asset={currentAsset} />}

            {/* Image */}
            {isImageAsset(currentAsset) && (
              <Image
                draggable={false}
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
