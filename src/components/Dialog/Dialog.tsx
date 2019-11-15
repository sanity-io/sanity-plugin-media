import React, {useCallback} from 'react'
import SanityDialog from 'part:@sanity/components/dialogs/default'
import DialogContent from 'part:@sanity/components/dialogs/content'
import Spinner from 'part:@sanity/components/loading/spinner'
import {WithReferringDocuments} from 'part:@sanity/base/with-referring-documents'

import {Asset} from '../../types'
import Box from '../../styled/Box'

type Props = {
  actions: {
    callback: () => void
    disabled?: boolean
    icon?: React.ReactNode
    title: string
  }[]
  asset: Asset
  children: (filteredDocuments: any) => React.ReactNode
  color?: 'default' | 'danger' | 'info' | 'success' | 'warning'
  onClose: () => void
  title: string
}

const Dialog = (props: Props) => {
  const {actions, asset, children, color, onClose, title} = props

  const handleDialogAction = useCallback(action => {
    if (action.callback) {
      action.callback()
    }
  }, [])

  return (
    <SanityDialog
      actions={actions}
      color={color}
      onAction={handleDialogAction}
      onClose={onClose}
      title={title}
    >
      <DialogContent size="medium">
        <Box display="grid" gridGap="1rem" gridTemplateColumns={['none', 'max-content 1fr']}>
          <img src={`${asset.url}?w=200`} style={{maxWidth: '200px'}} />

          <WithReferringDocuments id={asset._id}>
            {({isLoading, referringDocuments}: {isLoading: boolean; referringDocuments: any}) => {
              const drafts = referringDocuments.reduce(
                (acc: any, doc: any) =>
                  doc._id.startsWith('drafts.') ? acc.concat(doc._id.slice(7)) : acc,
                []
              )

              const filteredDocuments = referringDocuments.filter(
                (doc: any) => !drafts.includes(doc._id)
              )

              if (isLoading) {
                return <Spinner>Loading…</Spinner>
              }

              if (filteredDocuments.length === 0) {
                return <div>No documents are referencing this asset</div>
              }

              return <div>{children(filteredDocuments)}</div>
            }}
          </WithReferringDocuments>
        </Box>
      </DialogContent>
    </SanityDialog>
  )
}

export default Dialog
