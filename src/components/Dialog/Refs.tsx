import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {MdDeleteForever} from 'react-icons/md'

import {assetsDelete} from '../../modules/assets'
import {dialogClear} from '../../modules/dialog'
import {Item} from '../../types'
import DocumentList from '../DocumentList/DocumentList'
import Dialog from './Dialog'

type Props = {
  item: Item
}

const RefsDialog = (props: Props) => {
  const {item} = props

  const dispatch = useDispatch()

  const handleClose = useCallback(() => {
    dispatch(dialogClear())
  }, [])

  const handleDelete = useCallback(_asset => {
    dispatch(assetsDelete(_asset, 'dialog'))
  }, [])

  const dialogActions = [
    {
      callback: () => handleDelete(item.asset),
      disabled: item.updating,
      color: 'danger' as const,
      icon: MdDeleteForever,
      title: 'Delete'
    },
    {
      callback: handleClose,
      title: 'Close'
    }
  ]

  return (
    <Dialog
      actions={dialogActions}
      asset={item.asset}
      onClose={handleClose}
      title="Documents using this"
    >
      {filteredDocuments => {
        return <DocumentList documents={filteredDocuments} />
      }}
    </Dialog>
  )
}

export default RefsDialog
