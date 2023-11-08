/* eslint-disable no-console */
import {zodResolver} from '@hookform/resolvers/zod'
import {Box, Flex, Stack, Tab, TabList, TabPanel} from '@sanity/ui'
import {AssetFormData, DialogMassAssetEditProps, TagSelectOption} from '@types'
import React, {ReactNode, useCallback, useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {massEditAssetsFormSchema} from '../../formSchema'
import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogActions} from '../../modules/dialog'
import {selectTags, tagsActions} from '../../modules/tags'
import getTagSelectOptions from '../../utils/getTagSelectOptions'
import Dialog from '../Dialog'
import FormFieldInputTags from '../FormFieldInputTags'
import FormFieldInputText from '../FormFieldInputText'
import FormFieldInputTextarea from '../FormFieldInputTextarea'
import FormSubmitButton from '../FormSubmitButton'
import ProductSelector from '../ProductsSelector'
import sanitizeFormData from '../../utils/sanitizeFormData'
import {selectAssetsPicked, assetsActions} from '../../modules/assets'
import FormFieldInputSeasons from '../FormFieldInputSeasons'
import {seasonActions, selectSeasons} from '../../modules/seasons'
import getSeasonSelectOptions from '../../utils/getSeasonSelectOptions'
import getSeasonCollaborationOptions from '../../utils/getCollaborationSelectOptions'
import {collaborationActions, selectCollaborations} from '../../modules/collaborations'
import FormFieldInputCollaborations from '../FormFieldInputCollaborations'

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
  const selectedAssets = useTypedSelector(selectAssetsPicked)

  // Generate a snapshot of the current asset

  const [tabSection, setTabSection] = useState<'details' | 'references'>('details')
  const seasons = useTypedSelector(selectSeasons)
  const collaborations = useTypedSelector(selectCollaborations)

  const allTagOptions = getTagSelectOptions(tags)
  const allSeasonOptions = getSeasonSelectOptions(seasons)
  const allCollaborationOptions = getSeasonCollaborationOptions(collaborations)

  const defaultValues = {
    name: '',
    primaryProducts: [],
    secondaryProducts: [],
    season: null,
    collaboration: null,
    altText: '',
    description: '',
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
    resolver: zodResolver(massEditAssetsFormSchema)
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
      const sanitizedFormData = sanitizeFormData(formData)

      dispatch(
        assetsActions.massUpdateRequest({
          assets: selectedAssets.map(each => each.asset),
          closeDialogId: 'massEdit',
          formData: {
            ...sanitizedFormData,
            collaboration: {
              _ref: sanitizedFormData.collaboration.value,
              _type: 'reference',
              _weak: true
            },
            season: {
              _ref: sanitizedFormData.season.value,
              _type: 'reference',
              _weak: true
            },
            // Map tags to sanity references
            opt: {
              media: {
                ...sanitizedFormData.opt.media,
                tags:
                  sanitizedFormData.opt.media.tags?.map((tag: TagSelectOption) => ({
                    _ref: tag.value,
                    _type: 'reference',
                    _weak: true
                  })) || null
              }
            }
          }
        })
      )
      dispatch(dialogActions.remove({id: 'massEdit'}))
    },
    [dispatch, selectedAssets]
  )

  const handleCreateSeason = useCallback(
    (seasonName: string) => {
      // Dispatch action to create new tag
      dispatch(
        seasonActions.createRequest({
          name: seasonName
        })
      )
    },
    [dispatch]
  )

  const handleCreateCollaboration = useCallback(
    (collaborationName: string) => {
      // Dispatch action to create new tag
      dispatch(
        collaborationActions.createRequest({
          name: collaborationName
        })
      )
    },
    [dispatch]
  )

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
    <Dialog
      footer={<Footer />}
      header="Edit Selected Assets"
      id={id}
      onClose={handleClose}
      width={3}
    >
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
                label={``}
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
                  {/* Title */}
                  <FormFieldInputText
                    {...register('title')}
                    disabled={formUpdating}
                    error={errors?.title?.message}
                    label="Title"
                    name="title"
                    value={currentValues?.title}
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

                  {/* Seasons */}
                  <FormFieldInputSeasons
                    control={control}
                    disabled={formUpdating}
                    error={errors?.season?.message}
                    label="Seasons"
                    name="season"
                    onCreateSeason={handleCreateSeason}
                    options={allSeasonOptions}
                    placeholder="Select or create..."
                    value={currentValues?.season ?? null}
                  />

                  {/* name */}
                  {/* <FormFieldInputText
                    {...register('name')}
                    disabled={formUpdating}
                    error={errors?.name?.message}
                    label="name"
                    name="name"
                    value={''}
                  /> */}

                  {/* Collaborations */}
                  <FormFieldInputCollaborations
                    control={control}
                    disabled={formUpdating}
                    error={errors?.season?.message}
                    label="Drops"
                    name="collaboration"
                    onCreateSeason={handleCreateCollaboration}
                    options={allCollaborationOptions}
                    placeholder="Select or create..."
                    value={currentValues?.collaboration ?? null}
                  />
                  {/* products */}
                  <ProductSelector
                    onChange={updatedValue => {
                      setValue('primaryProducts', updatedValue, {shouldDirty: true})
                    }}
                    error={errors.products?.message}
                    value={currentValues?.products ?? []}
                    labelDescription="Add products to image"
                    label="Primary Products"
                    name="primaryProducts"
                  />

                  {/* products */}
                  <ProductSelector
                    onChange={updatedValue => {
                      setValue('secondaryProducts', updatedValue, {shouldDirty: true})
                    }}
                    error={errors.products?.message}
                    value={currentValues?.products ?? []}
                    labelDescription="Add products to image"
                    label="Secondary Products"
                    name="secondaryProducts"
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
      </Flex>

      {children}
    </Dialog>
  )
}

export default DialogMassAssetEdit
