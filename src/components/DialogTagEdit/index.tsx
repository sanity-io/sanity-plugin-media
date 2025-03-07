import {zodResolver} from '@hookform/resolvers/zod'
import type {MutationEvent} from '@sanity/client'
import {Box, Button, Card, Flex, Text} from '@sanity/ui'
import type {DialogTagEditProps, Tag, TagFormData} from '../../types'
import groq from 'groq'
import {type ReactNode, useCallback, useEffect, useState} from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {tagFormSchema} from '../../formSchema'
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

const DialogTagEdit = (props: Props) => {
  const {
    children,
    dialog: {id, tagId}
  } = props

  const client = useVersionedClient()

  const dispatch = useDispatch()
  const tagItem = useTypedSelector(state => selectTagById(state, String(tagId))) // TODO: double check string cast

  // - Generate a snapshot of the current tag
  const [tagSnapshot, setTagSnapshot] = useState(tagItem?.tag)

  const currentTag = tagItem ? tagItem?.tag : tagSnapshot
  const generateDefaultValues = (tag?: Tag) => ({
    name: tag?.name?.current || ''
  })

  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
    reset,
    setError
  } = useForm<TagFormData>({
    defaultValues: generateDefaultValues(tagItem?.tag),
    mode: 'onChange',
    resolver: zodResolver(tagFormSchema)
  })

  const formUpdating = !tagItem || tagItem?.updating

  const handleClose = () => {
    dispatch(dialogActions.remove({id}))
  }

  // Submit react-hook-form
  const onSubmit: SubmitHandler<TagFormData> = formData => {
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

  const handleTagUpdate = useCallback(
    (update: MutationEvent) => {
      const {result, transition} = update
      if (result && transition === 'update') {
        // Regenerate snapshot
        setTagSnapshot(result as Tag)
        // Reset react-hook-form
        reset(generateDefaultValues(result as Tag))
      }
    },
    [reset]
  )

  useEffect(() => {
    if (tagItem?.error) {
      setError('name', {
        message: tagItem.error?.message
      })
    }
  }, [setError, tagItem.error])

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
  }, [client, handleTagUpdate, tagItem?.tag])

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
    <Dialog animate footer={<Footer />} header="Edit Tag" id={id} onClose={handleClose} width={1}>
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
          {...register('name')}
          disabled={formUpdating}
          error={errors?.name?.message}
          label="Name"
          name="name"
        />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogTagEdit
