import {yupResolver} from '@hookform/resolvers/yup'
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
import {Asset} from '@types'
import groq from 'groq'
import client from 'part:@sanity/base/client'
import React, {FC, ReactNode, useCallback, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {AspectRatio} from 'theme-ui'
import * as yup from 'yup'

import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsUpdate} from '../../modules/assets'
// import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogRemove, dialogShowDeleteConfirm} from '../../modules/dialog'
import imageDprUrl from '../../util/imageDprUrl'
import AssetMetadata from '../AssetMetadata'
import DocumentList from '../DocumentList'
import FormFieldInputFilename from '../FormFieldInputFilename'
import FormFieldInputText from '../FormFieldInputText'
import FormFieldInputTextarea from '../FormFieldInputTextarea'
import Image from '../Image'

type Props = {
  asset: Asset
  children: ReactNode
  id: string
}

type FormData = yup.InferType<typeof formSchema>

const formSchema = yup.object().shape({
  originalFilename: yup.string().required('Filename cannot be empty')
})

const DialogDetails: FC<Props> = (props: Props) => {
  const {asset: initialAsset, children, id} = props

  // State
  const [currentAsset, setCurrentAsset] = useState<Asset>()
  const [tabSection, setTabSection] = useState<'details' | 'references'>('details')

  const asset = currentAsset || initialAsset

  // Redux
  const dispatch = useDispatch()
  const item = useTypedSelector(state => state.assets.byIds)[asset._id]

  // react-hook-form
  const {errors, formState, handleSubmit, register, reset, setValue, watch} = useForm({
    mode: 'all', // NOTE: this forces re-renders on all changes!
    resolver: yupResolver(formSchema)
  })

  // Callbacks
  const handleClose = useCallback(() => {
    dispatch(dialogRemove(id))
  }, [])

  const handleDelete = () => {
    dispatch(
      dialogShowDeleteConfirm(asset, {
        closeDialogId: id
      })
    )
  }

  const handleUpdate = update => {
    setCurrentAsset(update.result)
  }

  // - submit react-hook-form
  const onSubmit = async (formData: FormData) => {
    dispatch(
      assetsUpdate(
        asset,
        // Form data
        {
          ...formData,
          originalFilename: `${formData.originalFilename}.${asset.extension}` // Append extension to filename
        },
        // Options
        {
          closeDialogId: id
        }
      )
    )
  }

  // Effects
  // - Fetch initial value + initialize subscriber
  useEffect(() => {
    // Remember that Sanity listeners ignore joins, order clauses and projections
    const QUERY = groq`*[_id == $id]`

    /*
    // Fetch initial value
    // client.fetch(QUERY, {id: asset._id}).then(result => {
    client.getDocument(asset._id).then(result => {
      console.log('initial - result', result)
      // setCurrentAsset(result)
    })
    */

    // Listen for changes
    const subscription = client.listen(QUERY, {id: asset._id}).subscribe(handleUpdate)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const imageUrl = imageDprUrl(asset, 250)

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
          // icon={PublishIcon}
          onClick={handleSubmit(onSubmit)}
          text="Save and close"
          tone="primary"
        />
      </Flex>
    </Box>
  )

  const extensionIndex = asset.originalFilename.lastIndexOf(`.${asset.extension}`)
  const filenameWithoutExtension = asset.originalFilename.slice(0, extensionIndex)

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
          <AspectRatio ratio={asset?.metadata?.dimensions?.aspectRatio}>
            <Image draggable={false} showCheckerboard={!asset?.metadata?.isOpaque} src={imageUrl} />
          </AspectRatio>

          {/* Metadata */}
          <AssetMetadata asset={asset} item={item} />
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
                {/* Filename */}
                <FormFieldInputFilename
                  disabled={!item || item?.updating}
                  error={errors?.originalFilename}
                  extension={asset?.extension}
                  label="Filename"
                  name="originalFilename"
                  ref={register}
                  // value={asset?.originalFilename}
                  value={filenameWithoutExtension}
                />
                {/* Alt text */}
                <FormFieldInputText
                  disabled={!item || item?.updating}
                  error={errors?.altText}
                  label="Alt Text"
                  name="altText"
                  ref={register}
                  value={asset?.altText}
                />
                {/* Title */}
                <FormFieldInputText
                  disabled={!item || item?.updating}
                  error={errors?.title}
                  label="Title"
                  name="title"
                  ref={register}
                  value={asset?.title}
                />
                {/* Description */}
                <FormFieldInputTextarea
                  disabled={!item || item?.updating}
                  error={errors?.description}
                  label="Description"
                  name="description"
                  ref={register}
                  rows={3}
                  value={asset?.description}
                />

                {/* Form field */}
                {/*
              <Box>
                <Box marginBottom={1} paddingY={2}>
                  <Text size={1} weight="semibold">
                    Tags
                  </Text>
                </Box>
                <Select placeholder="tags" />
              </Box>
              */}
              </Stack>
            </TabPanel>

            <TabPanel
              aria-labelledby="references"
              hidden={tabSection !== 'references'}
              id="references-panel"
            >
              <DocumentList assetId={item.asset._id} />
            </TabPanel>
          </Box>
        </Box>
      </Grid>

      {children}
    </Dialog>
  )
}

export default DialogDetails
