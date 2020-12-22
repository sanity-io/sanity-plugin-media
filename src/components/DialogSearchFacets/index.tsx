import {Box, Dialog} from '@sanity/ui'
import React, {FC, ReactNode, useCallback} from 'react'
import {useDispatch} from 'react-redux'

import {dialogClear} from '../../modules/dialog'
import SearchFacets from '../SearchFacets'
import SearchFacetsControl from '../SearchFacetsControl'

type Props = {
  children: ReactNode
  id: string
}

const DialogSearchFacets: FC<Props> = (props: Props) => {
  const {children, id} = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleClose = useCallback(() => {
    dispatch(dialogClear())
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
