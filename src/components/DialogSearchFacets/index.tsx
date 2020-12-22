import {Box, Dialog} from '@sanity/ui'
import React, {FC, useCallback} from 'react'
import {useDispatch} from 'react-redux'

import {dialogClear} from '../../modules/dialog'
import SearchFacets from '../SearchFacets'
import SearchFacetsControl from '../SearchFacetsControl'

const DialogSearchFacets: FC = () => {
  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleClose = useCallback(() => {
    dispatch(dialogClear())
  }, [])

  return (
    <Dialog scheme="dark" header="Filters" id="searchFacets" onClose={handleClose} width={1}>
      <Box padding={3}>
        <SearchFacets layout="stack" />
        <SearchFacetsControl />
      </Box>
    </Dialog>
  )
}

export default DialogSearchFacets
