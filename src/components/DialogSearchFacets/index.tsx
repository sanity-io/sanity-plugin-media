import {Box} from '@sanity/ui'
import {DialogSearchFacetsProps} from '@types'
import React, {FC, ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {Z_INDEX_DIALOG} from '../../constants'
import {dialogActions} from '../../modules/dialog'
import Dialog from '../Dialog'
import SearchFacets from '../SearchFacets'
import SearchFacetsControl from '../SearchFacetsControl'

type Props = {
  children: ReactNode
  dialog: DialogSearchFacetsProps
}

const DialogSearchFacets: FC<Props> = (props: Props) => {
  const {
    children,
    dialog: {id}
  } = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleClose = useCallback(() => {
    dispatch(dialogActions.clear())
  }, [dispatch])

  return (
    <Dialog header="Filters" id={id} onClose={handleClose} width={1} zOffset={Z_INDEX_DIALOG}>
      <Box padding={3}>
        <SearchFacets layout="stack" />
        <SearchFacetsControl />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogSearchFacets
