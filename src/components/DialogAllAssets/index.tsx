import {Box} from '@sanity/ui'
import React, {ReactNode} from 'react'
import Dialog from '../Dialog'
import {DialogAllAssetsProps} from '@types'
import {dialogActions} from '../../modules/dialog'
import {useDispatch} from 'react-redux'

type Props = {
  children: ReactNode
  dialog: DialogAllAssetsProps
}

const DialogAllAssets = (props: Props) => {
  const {
    children,
    dialog: {id}
  } = props

  const dispatch = useDispatch()
  const handleClose = () => {
    dispatch(dialogActions.clear())
  }

  return (
    <Dialog header="Choose an asset for replacing" id={id} width={2} onClose={handleClose}>
      <Box
        style={{
          height: '100%'
        }}
        padding={4}
      >
        <p>Assets overview</p>
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogAllAssets
