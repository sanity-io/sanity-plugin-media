import {zodResolver} from '@hookform/resolvers/zod'
import {Box, Flex} from '@sanity/ui'
import {TagFormData} from '@types'
import React, {ReactNode, useEffect} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {tagFormSchema} from '../../formSchema'
import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogActions} from '../../modules/dialog'
import sanitizeFormData from '../../utils/sanitizeFormData'
import Dialog from '../Dialog'
import FormFieldInputText from '../FormFieldInputText'
import FormSubmitButton from '../FormSubmitButton'
import {DialogSeasonCreateProps} from '../../types'
import {seasonActions} from '../../modules/seasons'

type Props = {
  children: ReactNode
  dialog: DialogSeasonCreateProps
}

const DialogSeasonCreate = (props: Props) => {
  const {
    children,
    dialog: {id}
  } = props

  const dispatch = useDispatch()

  const creating = useTypedSelector(state => state.seasons.creating)
  const creatingError = useTypedSelector(state => state.seasons.creatingError)

  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
    setError
  } = useForm<TagFormData>({
    defaultValues: {
      name: ''
    },
    mode: 'onChange',
    resolver: zodResolver(tagFormSchema)
  })

  const formUpdating = creating

  const handleClose = () => {
    dispatch(dialogActions.clear())
  }

  // - submit react-hook-form
  const onSubmit: SubmitHandler<TagFormData> = formData => {
    const sanitizedFormData = sanitizeFormData(formData)

    dispatch(seasonActions.createRequest({name: sanitizedFormData.name}))
    dispatch(dialogActions.clear())
  }

  useEffect(() => {
    if (creatingError) {
      setError('name', {
        message: creatingError?.message
      })
    }
  }, [creatingError, setError])

  const Footer = () => (
    <Box padding={3}>
      <Flex justify="flex-end">
        {/* Submit button */}
        <FormSubmitButton
          disabled={formUpdating || !isDirty || !isValid}
          isValid={isValid}
          onClick={handleSubmit(onSubmit)}
        />
      </Flex>
    </Box>
  )

  return (
    <Dialog footer={<Footer />} header="Create Season" id={id} onClose={handleClose} width={1}>
      {/* Form fields */}
      <Box as="form" padding={4} onSubmit={handleSubmit(onSubmit)}>
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

export default DialogSeasonCreate
