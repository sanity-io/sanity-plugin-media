import {Dialog} from '@types'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import DialogDeleteConfirm from '../DialogDeleteConfirm'
import DialogDetails from '../DialogDetails'
import DialogSearchFacets from '../DialogSearchFacets'

const Dialogs: FC = () => {
  // Redux
  const {items} = useTypedSelector(state => state.dialog)

  const renderDialogs = (items: Dialog[], index: number) => {
    if (items.length === 0 || index >= items.length) {
      return null
    }

    const item = items[index]

    const childDialogs = renderDialogs(items, index + 1)

    if (item.type === 'deleteConfirm') {
      return (
        <DialogDeleteConfirm
          asset={item?.asset}
          closeDialogId={item.closeDialogId}
          id={item.id}
          key={index}
        >
          {childDialogs}
        </DialogDeleteConfirm>
      )
    }

    if (item.type === 'details' && item.asset) {
      return (
        <DialogDetails asset={item.asset} id={item.id} key={index}>
          {childDialogs}
        </DialogDetails>
      )
    }

    if (item.type === 'searchFacets') {
      return (
        <DialogSearchFacets id={item.id} key={index}>
          {childDialogs}
        </DialogSearchFacets>
      )
    }

    return null
  }

  return renderDialogs(items, 0)
}

export default Dialogs
