import type {MutationEvent} from '@sanity/client'
import {Card, Flex} from '@sanity/ui'
import {Asset, Tag} from '@types'
import groq from 'groq'
import React, {FC, useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {client} from '../../client'
import {TAG_DOCUMENT_NAME} from '../../constants'
import {assetsActions} from '../../modules/assets'
import {tagsActions} from '../../modules/tags'
import Controls from '../Controls'
import DebugControls from '../DebugControls'
import Dialogs from '../Dialogs'
import Header from '../Header'
import Items from '../Items'
import Notifications from '../Notifications'
import PickedBar from '../PickedBar'
import TagsPanel from '../TagsPanel'
import UploadDropzone from '../UploadDropzone'

type Props = {
  onClose?: () => void
}

const Browser: FC<Props> = (props: Props) => {
  const {onClose} = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleAssetUpdate = (update: MutationEvent) => {
    const {documentId, result, transition} = update

    if (transition === 'appear') {
      dispatch(assetsActions.listenerCreateQueue({asset: result as Asset}))
    }

    if (transition === 'disappear') {
      dispatch(assetsActions.listenerDeleteQueue({assetId: documentId}))
    }

    if (transition === 'update') {
      dispatch(assetsActions.listenerUpdateQueue({asset: result as Asset}))
    }
  }

  const handleTagUpdate = (update: MutationEvent) => {
    const {documentId, result, transition} = update

    if (transition === 'appear') {
      dispatch(tagsActions.listenerCreateQueue({tag: result as Tag}))
    }

    if (transition === 'disappear') {
      dispatch(tagsActions.listenerDeleteQueue({tagId: documentId}))
    }

    if (transition === 'update') {
      dispatch(tagsActions.listenerUpdateQueue({tag: result as Tag}))
    }
  }

  // Effects
  useEffect(() => {
    // Fetch assets: first page
    dispatch(assetsActions.loadPageIndex({pageIndex: 0}))

    // Fetch all tags
    dispatch(tagsActions.fetchRequest())

    // Listen for asset and tag changes in published documents.
    // Remember that Sanity listeners ignore joins, order clauses and projections!
    // Also note that changes to the selected document (if present) will automatically re-load the media plugin
    // due to the desk pane re-rendering.
    const subscriptionAsset = client
      .listen(
        groq`*[_type in ["sanity.fileAsset", "sanity.imageAsset"] && !(_id in path("drafts.**"))]`
      )
      .subscribe(handleAssetUpdate)

    const subscriptionTag = client
      .listen(groq`*[_type == "${TAG_DOCUMENT_NAME}" && !(_id in path("drafts.**"))]`)
      .subscribe(handleTagUpdate)

    return () => {
      subscriptionAsset?.unsubscribe()
      subscriptionTag?.unsubscribe()
    }
  }, [])

  return (
    <UploadDropzone>
      <Dialogs />
      <Notifications />

      <Card
        style={{
          height: '100%',
          minHeight: '100%'
        }}
      >
        <Flex
          direction="column"
          style={{
            height: '100%',
            minHeight: '100%'
          }}
        >
          {/* Header */}
          <Header onClose={onClose} />

          {/* Browser Controls */}
          <Controls />

          <Flex flex={1}>
            <Flex align="flex-end" direction="column" flex={1} style={{position: 'relative'}}>
              <Items />
              <PickedBar />
            </Flex>

            <TagsPanel />
          </Flex>

          {/* Debug */}
          <DebugControls />
        </Flex>
      </Card>
    </UploadDropzone>
  )
}

export default Browser
