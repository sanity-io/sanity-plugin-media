import {hues} from '@sanity/color'
import {Box} from '@sanity/ui'
import {DialogTags} from '@types'
import React, {FC, ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {Z_INDEX_DIALOG} from '../../constants'
import {dialogActions} from '../../modules/dialog'
import Dialog from '../Dialog'
import TagView from '../TagView'

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
    <Dialog header="All Tags" id={id} onClose={handleClose} width={1} zOffset={Z_INDEX_DIALOG}>
      <Box
        style={{
          borderTop: `1px solid ${hues.gray?.[900].hex}`,
          height: '100%',
          minHeight: '420px'
        }}
      >
        <TagView />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogTags
