import {Dialog} from '@types'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import DialogDeleteConfirm from '../DialogDeleteConfirm'
import DialogDetails from '../DialogDetails'
import DialogSearchFacets from '../DialogSearchFacets'

const Dialogs: FC = () => {
  // Redux
  const dialogs = useTypedSelector(state => state.dialog.items)

  const renderDialogs = (dialogs: Dialog[], index: number) => {
    if (dialogs.length === 0 || index >= dialogs.length) {
      return null
    }

    const dialog = dialogs[index]
    const childDialogs = renderDialogs(dialogs, index + 1)

    if (dialog.type === 'deleteConfirm') {
      return (
        <DialogDeleteConfirm dialog={dialog} key={index}>
          {childDialogs}
        </DialogDeleteConfirm>
      )
    }

    if (dialog.type === 'details') {
      return (
        <DialogDetails dialog={dialog} key={index}>
          {childDialogs}
        </DialogDetails>
      )
    }

    if (dialog.type === 'searchFacets') {
      return (
        <DialogSearchFacets dialog={dialog} key={index}>
          {childDialogs}
        </DialogSearchFacets>
      )
    }

    return null
  }

  return renderDialogs(dialogs, 0)
}

export default Dialogs
