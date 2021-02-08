import {MutationEvent} from '@sanity/client'
import {Box, Card, Flex} from '@sanity/ui'
import {ImageAsset, Tag} from '@types'
import groq from 'groq'
import client from 'part:@sanity/base/client'
import React, {FC, useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {TAG_DOCUMENT_NAME} from '../../constants'
import {assetsListenerDelete, assetsListenerUpdate, assetsLoadPageIndex} from '../../modules/assets'
import {
  tagsListenerDelete,
  tagsListenerUpdate,
  tagsFetch,
  tagsListenerCreate
} from '../../modules/tags'
import Controls from '../Controls'
import DebugControls from '../DebugControls'
import Dialogs from '../Dialogs'
import Header from '../Header'
import Items from '../Items'
import Notifications from '../Notifications'
import PickedBar from '../PickedBar'
import TagsPanel from '../TagsPanel'

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

    if (transition === 'disappear') {
      dispatch(assetsListenerDelete(documentId))
    }

    if (transition === 'update') {
      dispatch(assetsListenerUpdate(result as ImageAsset))
    }
  }

  const handleTagUpdate = (update: MutationEvent) => {
    const {documentId, result, transition} = update

    if (transition === 'appear') {
      dispatch(tagsListenerCreate(result as Tag))
    }

    if (transition === 'disappear') {
      dispatch(tagsListenerDelete(documentId))
    }

    if (transition === 'update') {
      dispatch(tagsListenerUpdate(result as Tag))
    }
  }

  // Effects
  useEffect(() => {
    // Fetch assets: first page
    dispatch(assetsLoadPageIndex(0))

    // Fetch all tags
    dispatch(tagsFetch())

    // Listen for asset + tag changes
    // (Remember that Sanity listeners ignore joins, order clauses and projections!)
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
    <>
      <Notifications />
      <Dialogs />

      <Card
        scheme="dark"
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

          <Box flex={1} style={{position: 'relative'}}>
            <Items />
            <TagsPanel />
          </Box>

          {/* Items */}
          <PickedBar />

          {/* Debug */}
          <DebugControls />
        </Flex>
      </Card>
    </>
  )
}

export default Browser
