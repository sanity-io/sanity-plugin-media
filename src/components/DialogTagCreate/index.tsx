import {Box, Dialog} from '@sanity/ui'
import {DialogTagCreate} from '@types'
import React, {FC, ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'

import {dialogClear} from '../../modules/dialog'

type Props = {
  children: ReactNode
  dialog: DialogTagCreate
}

const DialogTagCreate: FC<Props> = (props: Props) => {
  const {
    children,
    dialog: {id}
  } = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleClose = useCallback(() => {
    dispatch(dialogClear())
  }, [])

  return (
    <Dialog scheme="dark" header="Create Tag" id={id} onClose={handleClose} width={1}>
      <Box padding={3}>(Create tag)</Box>

      {children}
    </Dialog>
  )
}

export default DialogTagCreate
