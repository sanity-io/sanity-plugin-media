import {zodResolver} from '@hookform/resolvers/zod'
import {Box, Flex, Text} from '@sanity/ui'
import {type ReactNode, useEffect} from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import type {DialogFolderRenameProps, FolderFormData} from '../../types'
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
  dialog: DialogFolderRenameProps
}

const DialogFolderRename = ({children, dialog}: Props) => {
  const {folderPath, id} = dialog
  const dispatch = useDispatch()
  const renaming = useTypedSelector(state => state.folders.renaming)
  const renameError = useTypedSelector(state => state.folders.renameError)
  const currentName = folderPath.split('/').pop() || folderPath
  const parentPath = folderPath.includes('/') ? folderPath.slice(0, folderPath.lastIndexOf('/')) : null

  const {
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
    setError
  } = useForm<FolderFormData>({
    defaultValues: {
      name: currentName
    },
    mode: 'onChange',
    resolver: zodResolver(folderFormSchema)
  })

  const handleClose = () => {
    dispatch(dialogActions.remove({id}))
  }

  const onSubmit: SubmitHandler<FolderFormData> = formData => {
    const sanitizedFormData = sanitizeFormData(formData)
    dispatch(
      foldersActions.renameRequest({
        name: sanitizedFormData.name,
        path: folderPath
      })
    )
  }

  useEffect(() => {
    if (renameError) {
      setError('name', {message: renameError.message})
    }
  }, [renameError, setError])

  return (
    <Dialog
      animate
      footer={
        <Box padding={3}>
          <Flex justify="flex-end">
            <FormSubmitButton
              disabled={renaming || !isDirty || !isValid}
              isValid={isValid}
              onClick={handleSubmit(onSubmit)}
            />
          </Flex>
        </Box>
      }
      header="Rename Folder"
      id={id}
      onClose={handleClose}
      width={1}
    >
      <Box as="form" padding={4} onSubmit={handleSubmit(onSubmit)}>
        <button style={{display: 'none'}} tabIndex={-1} type="submit" />

        <Box marginBottom={3}>
          <Text muted size={1}>
            {parentPath ? `Renaming inside ${parentPath}` : 'Renaming at Home'}
          </Text>
        </Box>

        <FormFieldInputText
          {...register('name')}
          disabled={renaming}
          error={errors?.name?.message}
          label="Folder name"
          name="name"
        />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogFolderRename
