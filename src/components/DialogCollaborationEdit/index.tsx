import {zodResolver} from '@hookform/resolvers/zod'
import type {MutationEvent} from '@sanity/client'
import {Box, Button, Card, Flex, Text} from '@sanity/ui'
import {TagFormData} from '@types'
import groq from 'groq'
import React, {ReactNode, useCallback, useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {tagFormSchema} from '../../formSchema'
import useTypedSelector from '../../hooks/useTypedSelector'
import useVersionedClient from '../../hooks/useVersionedClient'
import {dialogActions} from '../../modules/dialog'
import sanitizeFormData from '../../utils/sanitizeFormData'
import Dialog from '../Dialog'
import FormFieldInputText from '../FormFieldInputText'
import FormSubmitButton from '../FormSubmitButton'
import {DialogCollaborationEditProps} from '../../types'
import {
  Collaboration,
  collaborationActions,
  selectCollaborationById
} from '../../modules/collaborations'
type Props = {
  children: ReactNode
  dialog: DialogCollaborationEditProps
}

const DialogCollaborationEdit = (props: Props) => {
  const {
    children,
    dialog: {id, collaborationId}
  } = props

  const client = useVersionedClient()

  const dispatch = useDispatch()
  const collaborationItem = useTypedSelector(state =>
    selectCollaborationById(state, String(collaborationId))
  ) // TODO: double check string cast

  // - Generate a snapshot of the current season
  const [collaborationSnapshot, setCollaborationSnapshot] = useState(
    collaborationItem?.collaboration
  )

  const currentCollaboration = collaborationItem
    ? collaborationItem?.collaboration
    : collaborationSnapshot
  const generateDefaultValues = (collaboration?: Collaboration) => ({
    name: collaboration?.name?.current || ''
  })

  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
    reset,
    setError
  } = useForm<TagFormData>({
    defaultValues: generateDefaultValues(collaborationItem?.collaboration),
    mode: 'onChange',
    resolver: zodResolver(tagFormSchema)
  })

  const formUpdating = !collaborationItem || collaborationItem?.updating

  const handleClose = () => {
    dispatch(dialogActions.remove({id}))
  }

  // Submit react-hook-form
  const onSubmit: SubmitHandler<TagFormData> = formData => {
    if (!collaborationItem?.collaboration) {
      return
    }
    const sanitizedFormData = sanitizeFormData(formData)
    dispatch(
      collaborationActions.updateCollaborationItemRequest({
        closeDialogId: collaborationItem?.collaboration?._id,
        formData: {
          name: {
            _type: 'slug',
            current: sanitizedFormData.name
          }
        },
        collaboration: collaborationItem?.collaboration
      })
    )
  }

  const handleDelete = () => {
    if (!collaborationItem?.collaboration) {
      return
    }

    dispatch(
      dialogActions.showConfirmDeleteCollaboration({
        closeDialogId: collaborationItem?.collaboration?._id,
        collaboration: collaborationItem?.collaboration
      })
    )
  }

  const handleCollaborationUpdate = useCallback(
    (update: MutationEvent) => {
      const {result, transition} = update
      if (result && transition === 'update') {
        // Regenerate snapshot
        setCollaborationSnapshot(result as Collaboration)
        // Reset react-hook-form
        reset(generateDefaultValues(result as Collaboration))
        dispatch(dialogActions.remove({id: collaborationItem?.collaboration?._id}))
      }
    },
    [reset]
  )

  useEffect(() => {
    if (collaborationItem?.error) {
      setError('name', {
        message: collaborationItem.error?.message
      })
    }
  }, [setError, collaborationItem.error])

  // - Listen for asset mutations and update snapshot
  useEffect(() => {
    if (!collaborationItem?.collaboration) {
      return undefined
    }

    // Remember that Sanity listeners ignore joins, order clauses and projections
    const subscriptionAsset = client
      .listen(groq`*[_id == $id]`, {id: collaborationItem?.collaboration._id})
      .subscribe(handleCollaborationUpdate)

    return () => {
      subscriptionAsset?.unsubscribe()
    }
  }, [client, handleCollaborationUpdate, collaborationItem?.collaboration])

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
          lastUpdated={collaborationItem?.collaboration?._updatedAt}
          onClick={handleSubmit(onSubmit)}
        />
      </Flex>
    </Box>
  )

  if (!currentCollaboration) {
    return null
  }

  return (
    <Dialog footer={<Footer />} header="Edit Collaboration" id={id} onClose={handleClose} width={1}>
      {/* Form fields */}
      <Box as="form" padding={4} onSubmit={handleSubmit(onSubmit)}>
        {/* Deleted notification */}
        {!collaborationItem && (
          <Card marginBottom={3} padding={3} radius={2} shadow={1} tone="critical">
            <Text size={1}>This collaboration cannot be found – it may have been deleted.</Text>
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

export default DialogCollaborationEdit
