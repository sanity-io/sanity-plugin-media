import {yupResolver} from '@hookform/resolvers/yup'
import {MutationEvent} from '@sanity/client'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Text
} from '@sanity/ui'
import {Asset, DialogDetails} from '@types'
import groq from 'groq'
import client from 'part:@sanity/base/client'
import React, {FC, ReactNode, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {AspectRatio} from 'theme-ui'
import * as yup from 'yup'

import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsUpdate} from '../../modules/assets'
import {dialogRemove, dialogShowDeleteConfirm} from '../../modules/dialog'
import {tagsCreate} from '../../modules/tags'
import imageDprUrl from '../../util/imageDprUrl'
import AssetMetadata from '../AssetMetadata'
import DocumentList from '../DocumentList'
import FormFieldInputFilename from '../FormFieldInputFilename'
import FormFieldInputTags from '../FormFieldInputTags'
import FormFieldInputText from '../FormFieldInputText'
import FormFieldInputTextarea from '../FormFieldInputTextarea'
import Image from '../Image'

type Props = {
  children: ReactNode
  dialog: DialogDetails
}

type FormData = yup.InferType<typeof formSchema>

const formSchema = yup.object().shape({
  originalFilename: yup.string().required('Filename cannot be empty')
})

// Strip keys with empty strings, undefined or null values
const sanitizeFormData = (formData: FormData) => {
  return Object.keys(formData).reduce((acc: Record<string, any>, key) => {
    if (formData[key] !== '' && formData[key] != null) {
      acc[key] = formData[key]
    }

    return acc
  }, {})
}

const getFilenameWithoutExtension = (asset?: Asset): string | undefined => {
  const extensionIndex = asset?.originalFilename?.lastIndexOf(`.${asset.extension}`)
  return asset?.originalFilename?.slice(0, extensionIndex)
}

const DialogDetails: FC<Props> = (props: Props) => {
  const {
    children,
    dialog: {assetId, id, lastCreatedTagId}
  } = props

  // Redux
  const dispatch = useDispatch()
  const byIds = useTypedSelector(state => state.assets.byIds)
  const item = byIds[assetId || '']
  const tagIds = useTypedSelector(state => state.tags.allIds)
  const tagsByIds = useTypedSelector(state => state.tags.byIds)

  const asset = item?.asset

  // State
  // - Generate a snapshot of the current asset
  const [assetSnapshot, setAssetSnapshot] = useState(asset)
  const [tabSection, setTabSection] = useState<'details' | 'references'>('details')

  const currentAsset = item ? asset : assetSnapshot

  const allTagOptions = tagIds.reduce((acc: {label: string; value: string}[], id) => {
    const tag = tagsByIds[id]?.tag

    if (tag) {
      acc.push({
        label: tag?.name?.current,
        value: tag?._id
      })
    }

    return acc
  }, [])

  // Map tag references to react-select options, skip over items with nullish labels or values
  const generateTagOptions = (asset?: Asset) => {
    return asset?.tags?.reduce((acc: {label: string; value: string}[], v) => {
      const tag = tagsByIds[v._ref]?.tag
      if (tag) {
        acc.push({
          label: tag?.name?.current,
          value: tag?._id
        })
      }
      return acc
    }, [])
  }

  const generateDefaultValues = (asset?: Asset) => ({
    altText: asset?.altText || '',
    description: asset?.description || '',
    originalFilename: asset ? getFilenameWithoutExtension(asset) : undefined,
    tags: generateTagOptions(asset) || null,
    title: asset?.title || ''
  })

  // Generate a string from all current tag labels
  // This is used purely to determine tag updates to then update the form in real time
  const currentTagLabels = generateTagOptions(currentAsset)
    ?.map(tag => tag.label)
    .join(',')

  const imageUrl = currentAsset ? imageDprUrl(currentAsset, 250) : undefined

  // react-hook-form
  const {control, errors, formState, getValues, handleSubmit, register, reset, setValue} = useForm({
    defaultValues: generateDefaultValues(asset),
    mode: 'onChange',
    resolver: yupResolver(formSchema)
  })

  // Callbacks
  const handleClose = () => {
    dispatch(dialogRemove(id))
  }

  const handleDelete = () => {
    if (!asset) {
      return
    }

    dispatch(
      dialogShowDeleteConfirm(asset._id, {
        closeDialogId: id
      })
    )
  }

  const handleAssetUpdate = (update: MutationEvent) => {
    const {result, transition} = update

    if (result && transition === 'update') {
      // Regenerate asset snapshot
      setAssetSnapshot(result as Asset)
    }
  }

  const handleCreateTag = (tagName: string) => {
    // Dispatch action to create new tag
    dispatch(
      tagsCreate(tagName, {
        assetId: currentAsset?._id
      })
    )
  }

  // - submit react-hook-form
  const onSubmit = async (formData: FormData) => {
    if (!asset) {
      return
    }

    // Sanitize form data: strip nullish values
    const sanitizedFormData = sanitizeFormData(formData)

    dispatch(
      assetsUpdate(
        asset,
        // Form data
        {
          ...sanitizedFormData,
          // Append extension to filename
          originalFilename: `${sanitizedFormData.originalFilename}.${asset.extension}`,
          // Map tags to sanity references
          tags:
            sanitizedFormData?.tags?.map((tag: {label: string; value: string}) => ({
              _ref: tag.value,
              _type: 'reference',
              _weak: true
            })) || null
        },
        // Options
        {
          closeDialogId: id
        }
      )
    )
  }

  // Effects
  // - Listen for asset mutations and update snapshot
  useEffect(() => {
    if (!asset) {
      return
    }

    // Remember that Sanity listeners ignore joins, order clauses and projections
    // - current asset
    const subscriptionAsset = client
      .listen(groq`*[_id == $id]`, {id: asset._id})
      .subscribe(handleAssetUpdate)

    return () => {
      subscriptionAsset?.unsubscribe()
    }
  }, [])

  // - Partially reset form when current tags have changed
  useEffect(() => {
    reset(
      {
        tags: generateTagOptions(currentAsset)
      },
      {
        errors: true,
        dirtyFields: true,
        isDirty: true
      }
    )
  }, [currentTagLabels])

  // - Update tags field with new tag if one has been created
  useEffect(() => {
    if (lastCreatedTagId) {
      const tag = tagsByIds[lastCreatedTagId]?.tag
      if (tag) {
        const existingTags = getValues('tags') || []
        const updatedTags = existingTags.concat([
          {
            label: tag.name.current,
            value: tag.name.current
          }
        ])

        setValue('tags', updatedTags)
      }
    }
  }, [lastCreatedTagId])

  const Footer = () => (
    <Box padding={3}>
      <Flex justify="space-between">
        {/* Delete button */}
        <Button
          disabled={!item || item?.updating}
          fontSize={1}
          mode="bleed"
          onClick={handleDelete}
          text="Delete"
          tone="critical"
        />

        {/* Submit button */}
        <Button
          disabled={!item || item?.updating || !formState.isDirty || !formState.isValid}
          fontSize={1}
          onClick={handleSubmit(onSubmit)}
          text="Save and close"
          tone="primary"
        />
      </Flex>
    </Box>
  )

  return (
    <Dialog
      footer={<Footer />}
      header="Asset details"
      id={id}
      onClose={handleClose}
      scheme="dark"
      width={3}
    >
      <Grid columns={[1, 1, 2]}>
        <Box padding={4}>
          {/* Image */}
          {imageUrl && (
            <AspectRatio ratio={currentAsset?.metadata?.dimensions?.aspectRatio}>
              <Image
                draggable={false}
                showCheckerboard={!currentAsset?.metadata?.isOpaque}
                src={imageUrl}
              />
            </AspectRatio>
          )}

          {/* Metadata */}
          {currentAsset && <AssetMetadata asset={currentAsset} item={item} />}
        </Box>

        <Box padding={4}>
          {/* Tabs */}
          <TabList space={2}>
            <Tab
              aria-controls="details-panel"
              disabled={!item}
              id="details-tab"
              label="Details"
              onClick={() => setTabSection('details')}
              selected={tabSection === 'details'}
              size={2}
            />
            <Tab
              aria-controls="references-panel"
              disabled={!item}
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
            {!item && (
              <Card marginBottom={3} padding={3} radius={2} shadow={1} tone="critical">
                <Text size={1}>This file cannot be found – it may have been deleted.</Text>
              </Card>
            )}

            {/* Hidden button to enable enter key submissions */}
            <button style={{display: 'none'}} tabIndex={-1} type="submit" />

            {/* Tab panels */}
            <TabPanel
              aria-labelledby="details"
              hidden={tabSection !== 'details'}
              id="details-panel"
            >
              <Stack space={3}>
                {/* Tags */}
                <FormFieldInputTags
                  control={control}
                  disabled={!item || item?.updating}
                  error={errors?.tags}
                  label="Tags"
                  name="tags"
                  onCreateTag={handleCreateTag}
                  options={allTagOptions}
                  value={generateTagOptions(currentAsset)}
                />
                {/* Filename */}
                <FormFieldInputFilename
                  disabled={!item || item?.updating}
                  error={errors?.originalFilename}
                  extension={currentAsset?.extension || ''}
                  label="Filename"
                  name="originalFilename"
                  ref={register}
                  value={getFilenameWithoutExtension(currentAsset)}
                />
                {/* Alt text */}
                <FormFieldInputText
                  disabled={!item || item?.updating}
                  error={errors?.altText}
                  label="Alt Text"
                  name="altText"
                  ref={register}
                  value={currentAsset?.altText}
                />
                {/* Title */}
                <FormFieldInputText
                  disabled={!item || item?.updating}
                  error={errors?.title}
                  label="Title"
                  name="title"
                  ref={register}
                  value={currentAsset?.title}
                />
                {/* Description */}
                <FormFieldInputTextarea
                  disabled={!item || item?.updating}
                  error={errors?.description}
                  label="Description"
                  name="description"
                  ref={register}
                  rows={3}
                  value={currentAsset?.description}
                />
              </Stack>
            </TabPanel>

            <TabPanel
              aria-labelledby="references"
              hidden={tabSection !== 'references'}
              id="references-panel"
            >
              {asset && <DocumentList assetId={asset._id} />}
            </TabPanel>
          </Box>
        </Box>
      </Grid>

      {children}
    </Dialog>
  )
}

export default DialogDetails
