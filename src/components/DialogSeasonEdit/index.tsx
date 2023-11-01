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
import {DialogSeasonEditProps} from '../../types'
import {Season, seasonActions, selectSeasonById} from '../../modules/seasons'

type Props = {
  children: ReactNode
  dialog: DialogSeasonEditProps
}

const DialogSeasonEdit = (props: Props) => {
  const {
    children,
    dialog: {id, seasonId}
  } = props

  const client = useVersionedClient()

  const dispatch = useDispatch()
  const seasonItem = useTypedSelector(state => selectSeasonById(state, String(seasonId))) // TODO: double check string cast

  // - Generate a snapshot of the current season
  const [seasonSnapshot, setSeasonSnapshot] = useState(seasonItem?.season)

  const currentTag = seasonItem ? seasonItem?.season : seasonSnapshot
  const generateDefaultValues = (season?: Season) => ({
    name: season?.name?.current || ''
  })

  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
    reset,
    setError
  } = useForm<TagFormData>({
    defaultValues: generateDefaultValues(seasonItem?.season),
    mode: 'onChange',
    resolver: zodResolver(tagFormSchema)
  })

  const formUpdating = !seasonItem || seasonItem?.updating

  const handleClose = () => {
    dispatch(dialogActions.remove({id}))
  }

  // Submit react-hook-form
  const onSubmit: SubmitHandler<TagFormData> = formData => {
    if (!seasonItem?.season) {
      return
    }
    const sanitizedFormData = sanitizeFormData(formData)
    dispatch(
      seasonActions.updateSeasonItemRequest({
        closeDialogId: seasonItem?.season?._id,
        formData: {
          name: {
            _type: 'slug',
            current: sanitizedFormData.name
          }
        },
        season: seasonItem?.season
      })
    )
  }

  const handleDelete = () => {
    if (!seasonItem?.season) {
      return
    }

    dispatch(
      dialogActions.showConfirmDeleteTag({
        closeDialogId: seasonItem?.season?._id,
        tag: seasonItem?.season
      })
    )
  }

  const handleSeasonUpdate = useCallback(
    (update: MutationEvent) => {
      const {result, transition} = update
      if (result && transition === 'update') {
        // Regenerate snapshot
        setSeasonSnapshot(result as Season)
        // Reset react-hook-form
        reset(generateDefaultValues(result as Season))
        dispatch(dialogActions.remove({id: seasonItem?.season?._id}))
      }
    },
    [reset]
  )

  useEffect(() => {
    if (seasonItem?.error) {
      setError('name', {
        message: seasonItem.error?.message
      })
    }
  }, [setError, seasonItem.error])

  // - Listen for asset mutations and update snapshot
  useEffect(() => {
    if (!seasonItem?.season) {
      return undefined
    }

    // Remember that Sanity listeners ignore joins, order clauses and projections
    const subscriptionAsset = client
      .listen(groq`*[_id == $id]`, {id: seasonItem?.season._id})
      .subscribe(handleSeasonUpdate)

    return () => {
      subscriptionAsset?.unsubscribe()
    }
  }, [client, handleSeasonUpdate, seasonItem?.season])

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
          lastUpdated={seasonItem?.season?._updatedAt}
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
        {!seasonItem && (
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

export default DialogSeasonEdit
