import {IntentLink} from 'part:@sanity/base/router'
import {List, Item as ListItem} from 'part:@sanity/components/lists/default'
import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import MdInsertLink from 'react-icons/lib/md/insert-link'

import Dialog from './Dialog'
import {dialogClear} from '../../modules/dialog'
import {Item} from '../../types'
import Box from '../../styled/Box'

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

            <List>
              {filteredDocuments.map((doc: any) => {
                return (
                  <ListItem key={doc._id}>
                    <IntentLink
                      intent="edit"
                      params={{id: doc._id}}
                      key={doc._id}
                      // className={styles.intentLink}
                    >
                      <div>Preview goes here</div>
                      {/* <Preview value={doc} type={schema.get(doc._type)} /> */}
                      <span>
                        <MdInsertLink /> Open
                      </span>
                    </IntentLink>
                  </ListItem>
                )
              })}
            </List>
          </div>
        )
      }}
    </Dialog>
  )
}

export default ConflictsDialog
