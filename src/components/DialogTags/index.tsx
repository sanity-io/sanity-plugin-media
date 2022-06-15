import {hues} from '@sanity/color'
import {Box} from '@sanity/ui'
import {DialogTagsProps} from '@types'
import React, {ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {Z_INDEX_DIALOG} from '../../constants'
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
    // @ts-expect-error
    <Dialog header="All Tags" id={id} onClose={handleClose} width={1} zOffset={Z_INDEX_DIALOG}>
      <Box
        style={{
          borderTop: `1px solid ${hues.gray?.[900].hex}`,
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
