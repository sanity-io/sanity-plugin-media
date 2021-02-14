import {Box, Dialog} from '@sanity/ui'
import {DialogSearchFacets} from '@types'
import React, {FC, ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'

import {clear} from '../../modules/dialog'
import SearchFacets from '../SearchFacets'
import SearchFacetsControl from '../SearchFacetsControl'

type Props = {
  children: ReactNode
  dialog: DialogSearchFacets
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
    dispatch(clear())
  }, [])

  return (
    <Dialog scheme="dark" header="Filters" id={id} onClose={handleClose} width={1}>
      <Box padding={3}>
        <SearchFacets layout="stack" />
        <SearchFacetsControl />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogSearchFacets
