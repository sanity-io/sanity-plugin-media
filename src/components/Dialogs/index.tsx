import {Dialog} from '@types'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import DialogDeleteConfirm from '../DialogDeleteConfirm'
import DialogAssetEdit from '../DialogAssetEdit'
import DialogSearchFacets from '../DialogSearchFacets'
import DialogTagCreate from '../DialogTagCreate'
import DialogTagEdit from '../DialogTagEdit'
import DialogTags from '../DialogTags'

const Dialogs: FC = () => {
  // Redux
  const dialogs = useTypedSelector(state => state.dialog.items)

  const renderDialogs = (dialogs: Dialog[], index: number) => {
    if (dialogs.length === 0 || index >= dialogs.length) {
      return null
    }

    const dialog = dialogs[index]
    const childDialogs = renderDialogs(dialogs, index + 1)

    if (dialog.type === 'assetEdit') {
      return (
        <DialogAssetEdit dialog={dialog} key={index}>
          {childDialogs}
        </DialogAssetEdit>
      )
    }

    if (dialog.type === 'deleteConfirm') {
      return (
        <DialogDeleteConfirm dialog={dialog} key={index}>
          {childDialogs}
        </DialogDeleteConfirm>
      )
    }

    if (dialog.type === 'searchFacets') {
      return (
        <DialogSearchFacets dialog={dialog} key={index}>
          {childDialogs}
        </DialogSearchFacets>
      )
    }

    if (dialog.type === 'tagCreate') {
      return (
        <DialogTagCreate dialog={dialog} key={index}>
          {childDialogs}
        </DialogTagCreate>
      )
    }

    if (dialog.type === 'tagEdit') {
      return (
        <DialogTagEdit dialog={dialog} key={index}>
          {childDialogs}
        </DialogTagEdit>
      )
    }

    if (dialog.type === 'tags') {
      return (
        <DialogTags dialog={dialog} key={index}>
          {childDialogs}
        </DialogTags>
      )
    }

    return null
  }

  return renderDialogs(dialogs, 0)
}

export default Dialogs
