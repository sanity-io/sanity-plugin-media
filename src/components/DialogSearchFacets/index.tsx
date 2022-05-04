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
  }, [])

  return (
    <Dialog header="Filters" id={id} onClose={handleClose} width={1} zOffset={Z_INDEX_DIALOG}>
      <Box
        padding={3}
        style={{
          height: '100%'
          // HACK: we force minimum height to ensure our opened <MenuButton /> doesn't clip within the dialog.
          // Currently, a portaled <Menubutton /> doesn't increment its z-index when invoked from an existing <Portal />,
          // causing z-index issues.
        }}
      >
        <SearchFacets layout="stack" />
        <SearchFacetsControl />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogSearchFacets
