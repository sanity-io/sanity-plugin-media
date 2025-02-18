import {Box} from '@sanity/ui'
import React, {ReactNode} from 'react'
import Dialog from '../Dialog'
import {DialogAllAssetsProps} from '@types'
import {dialogActions} from '../../modules/dialog'
import {useDispatch} from 'react-redux'
import ReplaceAssetsOverview from '../ReplaceAssetsOverView'

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
    <Dialog header="Choose an asset for replacing" id={id} width={3} onClose={handleClose}>
      <Box padding={4} style={{height: '50vh'}}>
        <ReplaceAssetsOverview />
      </Box>
      {children}
    </Dialog>
  )
}

export default DialogAllAssets
