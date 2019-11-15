import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import LinkIcon from 'part:@sanity/base/link-icon'
import {IntentLink} from 'part:@sanity/base/router'
import TrashIcon from 'part:@sanity/base/trash-icon'
import {List, Item as ListItem} from 'part:@sanity/components/lists/default'

import Dialog from './Dialog'
import {assetsDelete} from '../../modules/assets'
import {dialogClear} from '../../modules/dialog'
import {Item} from '../../types'

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
      icon: TrashIcon,
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
        return (
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
                      <LinkIcon /> Open
                    </span>
                  </IntentLink>
                </ListItem>
              )
            })}
          </List>
        )
      }}
    </Dialog>
  )
}

export default RefsDialog
