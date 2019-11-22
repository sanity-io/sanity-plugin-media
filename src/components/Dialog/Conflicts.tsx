import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'

import {dialogClear} from '../../modules/dialog'
import Box from '../../styled/Box'
import {Item} from '../../types'
import DocumentList from '../DocumentList/DocumentList'
import Dialog from './Dialog'

type Props = {
  item: Item
}

const ConflictsDialog = (props: Props) => {
  const {item} = props

  const dispatch = useDispatch()

  const handleClose = useCallback(() => {
    dispatch(dialogClear())
  }, [])

  const dialogActions = [
    {
      callback: handleClose,
      title: 'Close'
    }
  ]

  return (
    <Dialog
      actions={dialogActions}
      asset={item.asset}
      color="danger"
      onClose={handleClose}
      title="Could not delete assets"
    >
      {filteredDocuments => {
        return (
          <div>
            <div>
              <Box as="h4" m={0} p={0}>
                {filteredDocuments.length > 1
                  ? `${filteredDocuments.length} documents are using this asset`
                  : 'A document is using this asset'}
              </Box>
              <Box as="p" fontSize={[1]}>
                {`Open the document${
                  filteredDocuments.length > 1 ? 's' : ''
                } and remove the asset before deleting it.`}
              </Box>
            </div>

            <DocumentList documents={filteredDocuments} />
          </div>
        )
      }}
    </Dialog>
  )
}

export default ConflictsDialog
