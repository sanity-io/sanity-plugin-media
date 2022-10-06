import {Box} from '@sanity/ui'
import {DialogSearchFacetsProps} from '@types'
import React, {ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {dialogActions} from '../../modules/dialog'
import Dialog from '../Dialog'
import SearchFacets from '../SearchFacets'
import SearchFacetsControl from '../SearchFacetsControl'

type Props = {
  children: ReactNode
  dialog: DialogSearchFacetsProps
}

const DialogSearchFacets = (props: Props) => {
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
    <Dialog header="Filters" id={id} onClose={handleClose} width={1}>
      <Box padding={3}>
        <SearchFacets layout="stack" />
        <SearchFacetsControl />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogSearchFacets
