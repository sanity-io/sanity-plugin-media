import {yupResolver} from '@hookform/resolvers/yup'
import type {MutationEvent} from '@sanity/client'
import {Box, Button, Card, Flex, Text} from '@sanity/ui'
import {DialogTagEditProps, Tag} from '@types'
import groq from 'groq'
import React, {ReactNode, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import * as yup from 'yup'
import useTypedSelector from '../../hooks/useTypedSelector'
import useVersionedClient from '../../hooks/useVersionedClient'
import {dialogActions} from '../../modules/dialog'
import {selectTagById, tagsActions} from '../../modules/tags'
import sanitizeFormData from '../../utils/sanitizeFormData'
import Dialog from '../Dialog'
import FormFieldInputText from '../FormFieldInputText'
import FormSubmitButton from '../FormSubmitButton'

type Props = {
  children: ReactNode
  dialog: DialogTagEditProps
}

type FormData = yup.InferType<typeof formSchema>

const formSchema = yup.object().shape({
  name: yup.string().required('Name cannot be empty')
})

const DialogTagEdit = (props: Props) => {
  const {
    children,
    dialog: {id, tagId}
  } = props

  const client = useVersionedClient()

  // Redux
  const dispatch = useDispatch()
  const tagItem = useTypedSelector(state => selectTagById(state, String(tagId))) // TODO: double check string cast

  // State
  // - Generate a snapshot of the current tag
  const [tagSnapshot, setTagSnapshot] = useState(tagItem?.tag)

  const currentTag = tagItem ? tagItem?.tag : tagSnapshot
  const generateDefaultValues = (tag?: Tag) => ({
    name: tag?.name?.current || ''
  })

  // react-hook-form
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
    reset,
    setError
  } = useForm({
    // defaultValues: {
    //   name: currentTag?.tag?.name?.current
    // },
    defaultValues: generateDefaultValues(tagItem?.tag),
    mode: 'onChange',
    resolver: yupResolver(formSchema)
  })

  const formUpdating = !tagItem || tagItem?.updating

  // Callbacks
  const handleClose = () => {
    dispatch(dialogActions.remove({id}))
  }

  // - submit react-hook-form
  const onSubmit = async (formData: FormData) => {
    if (!tagItem?.tag) {
      return
    }

    const sanitizedFormData = sanitizeFormData(formData)

    dispatch(
      tagsActions.updateRequest({
        closeDialogId: tagItem?.tag?._id,
        formData: {
          name: {
            _type: 'slug',
            current: sanitizedFormData.name
          }
        },
        tag: tagItem?.tag
      })
    )
  }

  const handleDelete = () => {
    if (!tagItem?.tag) {
      return
    }

    dispatch(
      dialogActions.showConfirmDeleteTag({
        closeDialogId: tagItem?.tag?._id,
        tag: tagItem?.tag
      })
    )
  }

  const handleTagUpdate = (update: MutationEvent) => {
    const {result, transition} = update

    if (result && transition === 'update') {
      // Regenerate snapshot
      setTagSnapshot(result as Tag)

      // Reset react-hook-form
      reset(generateDefaultValues(result as Tag))
    }
  }

  // Effects
  useEffect(() => {
    if (tagItem?.error) {
      setError('name', {
        message: tagItem.error?.message
      })
    }
  }, [tagItem?.error])

  // - Listen for asset mutations and update snapshot
  useEffect(() => {
    if (!tagItem?.tag) {
      return undefined
    }

    // Remember that Sanity listeners ignore joins, order clauses and projections
    const subscriptionAsset = client
      .listen(groq`*[_id == $id]`, {id: tagItem?.tag._id})
      .subscribe(handleTagUpdate)

    return () => {
      subscriptionAsset?.unsubscribe()
    }
  }, [])

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
          lastUpdated={tagItem?.tag?._updatedAt}
          onClick={handleSubmit(onSubmit)}
        />
      </Flex>
    </Box>
  )

  if (!currentTag) {
    return null
  }

  return (
    <Dialog footer={<Footer />} header="Edit Tag" id={id} onClose={handleClose} width={1}>
      {/* Form fields */}
      <Box as="form" padding={4} onSubmit={handleSubmit(onSubmit)}>
        {/* Deleted notification */}
        {!tagItem && (
          <Card marginBottom={3} padding={3} radius={2} shadow={1} tone="critical">
            <Text size={1}>This tag cannot be found – it may have been deleted.</Text>
          </Card>
        )}

        {/* Hidden button to enable enter key submissions */}
        <button style={{display: 'none'}} tabIndex={-1} type="submit" />

        {/* Title */}
        <FormFieldInputText
          disabled={formUpdating}
          error={errors?.name}
          label="Name"
          name="name"
          ref={register}
        />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogTagEdit
