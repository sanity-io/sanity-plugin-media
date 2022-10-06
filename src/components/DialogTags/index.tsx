import {Box} from '@sanity/ui'
import {DialogTagsProps} from '@types'
import React, {ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {dialogActions} from '../../modules/dialog'
import Dialog from '../Dialog'
import TagView from '../TagView'

type Props = {
  children: ReactNode
  dialog: DialogTagsProps
}

const DialogTags = (props: Props) => {
  const {
    children,
    dialog: {id}
  } = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleClose = useCallback(() => {
    dispatch(dialogActions.clear())
  }, [])

  return (
    <Dialog header="All Tags" id={id} onClose={handleClose} width={1}>
      <Box
        style={{
          height: '100%',
          minHeight: '420px' // explicit height required as <TagView> is virtualized
        }}
      >
        <TagView />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogTags
