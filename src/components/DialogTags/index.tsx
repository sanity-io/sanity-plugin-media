import {hues} from '@sanity/color'
import {Box, Dialog} from '@sanity/ui'
import {DialogTags} from '@types'
import React, {FC, ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'

import {dialogActions} from '../../modules/dialog'
import Tags from '../Tags'

type Props = {
  children: ReactNode
  dialog: DialogTags
}

const DialogTags: FC<Props> = (props: Props) => {
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
    <Dialog scheme="dark" header="All Tags" id={id} onClose={handleClose} width={1}>
      <Box
        style={{
          borderTop: `1px solid ${hues.gray?.[900].hex}`
        }}
      >
        <Tags />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogTags
