/* eslint-disable no-console */
import {zodResolver} from '@hookform/resolvers/zod'
import {Box, Flex, Stack, Tab, TabList, TabPanel} from '@sanity/ui'
import {AssetFormData, DialogMassAssetEditProps, TagSelectOption} from '@types'
import React, {ReactNode, useCallback, useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {assetFormSchema} from '../../formSchema'
import useTypedSelector from '../../hooks/useTypedSelector'
// import {assetsActions} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import {selectTags, tagsActions} from '../../modules/tags'
import getTagSelectOptions from '../../utils/getTagSelectOptions'
// import sanitizeFormData from '../../utils/sanitizeFormData'
import Dialog from '../Dialog'
import FormFieldInputTags from '../FormFieldInputTags'
import FormFieldInputText from '../FormFieldInputText'
import FormFieldInputTextarea from '../FormFieldInputTextarea'
import FormSubmitButton from '../FormSubmitButton'
import FormFieldSelect from '../FormFieldSelect'
import ProductSelector from '../ProductsSelector'
import {loadCollaborations, loadSeasons} from '../../utils/loadCollaborations'

type Props = {
  children: ReactNode
  dialog: DialogMassAssetEditProps
}

const DialogMassAssetEdit = (props: Props) => {
  const {
    children,
    dialog: {id, lastCreatedTag, lastRemovedTagIds}
  } = props

  const dispatch = useDispatch()
  const tags = useTypedSelector(selectTags)

  // Generate a snapshot of the current asset

  const [tabSection, setTabSection] = useState<'details' | 'references'>('details')
  const [collaborationOptions, setCollaborationOptions] = useState<{id: string; name: string}[]>([])
  const [seasons, setSeasons] = useState<{id: string; name: string}[]>([])

  const allTagOptions = getTagSelectOptions(tags)

  const defaultValues = {
    name: '',
    products: [],
    season: '',
    collaboration: '',
    altText: '',
    description: '',
    originalFilename: '',
    title: '',
    opt: {media: {tags: []}}
  }
  const formUpdating = false
  const {
    control,
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isValid},
    getValues,
    handleSubmit,
    register,
    setValue
  } = useForm<AssetFormData>({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: zodResolver(assetFormSchema)
  })

  const currentValues = getValues()

  const handleClose = useCallback(() => {
    dispatch(dialogActions.remove({id}))
  }, [dispatch, id])

  const handleCreateTag = useCallback(
    (tagName: string) => {
      // Dispatch action to create new tag
      dispatch(
        tagsActions.createRequest({
          assetId: '',
          name: tagName
        })
      )
    },
    [dispatch]
  )

  // Submit react-hook-form
  const onSubmit: SubmitHandler<AssetFormData> = useCallback(
    formData => {
      console.log(formData)

      // const sanitizedFormData = sanitizeFormData(formData)

      // dispatch(
      //   assetsActions.updateRequest({
      //     asset: assetItem?.asset,
      //     closeDialogId: assetItem?.asset._id,
      //     formData: {
      //       ...sanitizedFormData,
      //       // Map tags to sanity references
      //       opt: {
      //         media: {
      //           ...sanitizedFormData.opt.media,
      //           tags:
      //             sanitizedFormData.opt.media.tags?.map((tag: TagSelectOption) => ({
      //               _ref: tag.value,
      //               _type: 'reference',
      //               _weak: true
      //             })) || null
      //         }
      //       }
      //     }
      //   })
      // )
    },
    [dispatch]
  )

  useEffect(() => {
    const setCollaboration = async () => {
      const [collabs, seasonOptions] = await Promise.all([loadCollaborations(), loadSeasons()])
      setCollaborationOptions(collabs)
      setSeasons(seasonOptions)
    }
    setCollaboration()
  }, [])

  // Update tags form field (react-select) when a new _inline_ tag has been created
  useEffect(() => {
    if (lastCreatedTag) {
      const existingTags = (getValues('opt.media.tags') as TagSelectOption[]) || []
      const updatedTags = existingTags.concat([lastCreatedTag])
      setValue('opt.media.tags', updatedTags, {shouldDirty: true})
    }
  }, [getValues, lastCreatedTag, setValue])

  // Update tags form field (react-select) when an _inline_ tag has been removed elsewhere
  useEffect(() => {
    if (lastRemovedTagIds) {
      const existingTags = (getValues('opt.media.tags') as TagSelectOption[]) || []
      const updatedTags = existingTags.filter(tag => {
        return !lastRemovedTagIds.includes(tag.value)
      })

      setValue('opt.media.tags', updatedTags, {shouldDirty: true})
    }
  }, [getValues, lastRemovedTagIds, setValue])

  const Footer = () => (
    <Box padding={3}>
      <Flex justify="space-between">
        {/* Submit button */}
        <FormSubmitButton disabled={!isValid} isValid={isValid} onClick={handleSubmit(onSubmit)} />
      </Flex>
    </Box>
  )

  return (
    <Dialog footer={<Footer />} header="Asset details" id={id} onClose={handleClose} width={3}>
      {/*
        We reverse direction to ensure the download button doesn't appear (in the DOM) before other tabbable items.
        This ensures that the dialog doesn't scroll down to the download button (which on smaller screens, can sometimes
        be below the fold).
      */}
      <Flex direction={['column-reverse', 'column-reverse', 'row-reverse']}>
        <Box flex={1} marginTop={[5, 5, 0]} padding={4}>
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
                disabled={false}
                id="references-tab"
                label={`References`}
                onClick={() => {}}
                selected={tabSection === 'references'}
                size={2}
              />
            </TabList>

            {/* Form fields */}
            <Box as="form" marginTop={4} onSubmit={handleSubmit(onSubmit)}>
              {/* Deleted notification */}

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
                    error={errors?.opt?.media?.tags?.message}
                    label="Tags"
                    name="opt.media.tags"
                    onCreateTag={handleCreateTag}
                    options={allTagOptions}
                    placeholder="Select or create..."
                    value={[]}
                  />
                  {/* name */}
                  <FormFieldInputText
                    {...register('name')}
                    disabled={formUpdating}
                    error={errors?.name?.message}
                    label="name"
                    name="name"
                    value={''}
                  />
                  {/* season */}
                  <FormFieldSelect
                    {...register('season')}
                    onSelect={value => {
                      setValue('season', value)
                    }}
                    options={seasons}
                    disabled={formUpdating}
                    error={errors?.name?.message}
                    label="season"
                    name="season"
                    initialValue={currentValues?.season}
                  />

                  {/* collaboration */}
                  <FormFieldSelect
                    {...register('collaboration')}
                    onSelect={value => setValue('collaboration', value)}
                    options={collaborationOptions}
                    disabled={formUpdating}
                    error={errors?.name?.message}
                    label="collaboration"
                    name="collaboration"
                  />
                  {/* products */}
                  <ProductSelector
                    onChange={updatedValue => {
                      setValue('products', updatedValue)
                    }}
                    error={errors.products?.message}
                    value={currentValues?.products ?? []}
                  />
                  {/* Title */}
                  <FormFieldInputText
                    {...register('title')}
                    disabled={formUpdating}
                    error={errors?.title?.message}
                    label="Title"
                    name="title"
                    value={currentValues?.title}
                  />
                  {/* Alt text */}
                  <FormFieldInputText
                    {...register('altText')}
                    disabled={formUpdating}
                    error={errors?.altText?.message}
                    label="Alt Text"
                    name="altText"
                    value={currentValues?.altText}
                  />
                  {/* Description */}
                  <FormFieldInputTextarea
                    {...register('description')}
                    disabled={formUpdating}
                    error={errors?.description?.message}
                    label="Description"
                    name="description"
                    rows={5}
                    value={currentValues?.description}
                  />
                </Stack>
              </TabPanel>

              {/* Panel: References */}
              <TabPanel
                aria-labelledby="references"
                hidden={tabSection !== 'references'}
                id="references-panel"
              />
            </Box>
          </>
        </Box>

        <Box flex={1} padding={4}>
          {/* Metadata */}
          {/* {currentValues && (
            <Box marginTop={4}>
              <AssetMetadata asset={currentValues} item={assetItem} />
            </Box>
          )} */}
        </Box>
      </Flex>

      {children}
    </Dialog>
  )
}

export default DialogMassAssetEdit
