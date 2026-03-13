import {zodResolver} from '@hookform/resolvers/zod'
import {Box, Flex, Text} from '@sanity/ui'
import type {DialogFolderCreateProps, FolderFormData} from '../../types'
import {type ReactNode, useEffect} from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {folderFormSchema} from '../../formSchema'
import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogActions} from '../../modules/dialog'
import {foldersActions} from '../../modules/folders'
import sanitizeFormData from '../../utils/sanitizeFormData'
import Dialog from '../Dialog'
import FormFieldInputText from '../FormFieldInputText'
import FormSubmitButton from '../FormSubmitButton'

type Props = {
  children: ReactNode
  dialog: DialogFolderCreateProps
}

const DialogFolderCreate = (props: Props) => {
  const {
    children,
    dialog: {folderPath, id}
  } = props

  const dispatch = useDispatch()
  const creating = useTypedSelector(state => state.folders.creating)
  const creatingError = useTypedSelector(state => state.folders.creatingError)

  const {
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
    setError
  } = useForm<FolderFormData>({
    defaultValues: {
      name: ''
    },
    mode: 'onChange',
    resolver: zodResolver(folderFormSchema)
  })

  const handleClose = () => {
    dispatch(dialogActions.clear())
  }

  const onSubmit: SubmitHandler<FolderFormData> = formData => {
    const sanitizedFormData = sanitizeFormData(formData)
    dispatch(
      foldersActions.createRequest({
        name: sanitizedFormData.name,
        parentPath: folderPath || null
      })
    )
  }

  useEffect(() => {
    if (creatingError) {
      setError('name', {message: creatingError.message})
    }
  }, [creatingError, setError])

  const Footer = () => (
    <Box padding={3}>
      <Flex justify="flex-end">
        <FormSubmitButton
          disabled={creating || !isDirty || !isValid}
          isValid={isValid}
          onClick={handleSubmit(onSubmit)}
        />
      </Flex>
    </Box>
  )

  return (
    <Dialog
      animate
      footer={<Footer />}
      header="Create Folder"
      id={id}
      onClose={handleClose}
      width={1}
    >
      <Box as="form" padding={4} onSubmit={handleSubmit(onSubmit)}>
        <button style={{display: 'none'}} tabIndex={-1} type="submit" />

        {folderPath && (
          <Box marginBottom={3}>
            <Text muted size={1}>
              Creating inside {folderPath}
            </Text>
          </Box>
        )}

        <FormFieldInputText
          {...register('name')}
          disabled={creating}
          error={errors?.name?.message}
          label="Folder name"
          name="name"
        />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogFolderCreate
