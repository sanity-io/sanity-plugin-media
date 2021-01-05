import {MutationEvent} from '@sanity/client'
import {Card, Flex} from '@sanity/ui'
import {Asset, Tag} from '@types'
import groq from 'groq'
import client from 'part:@sanity/base/client'
import React, {FC, useEffect} from 'react'
import {useDispatch} from 'react-redux'

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

type Props = {
  onClose?: () => void
}

const Browser: FC<Props> = (props: Props) => {
  const {onClose} = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleAssetUpdate = (update: MutationEvent) => {
    const {documentId, result, transition, type} = update

    if (type !== 'mutation') {
      return
    }

    // TODO: asset added
    if (transition === 'appear') {
      // TODO: how do we deal with 'allIds' ???
      // Scenarios:
      // - search results
      // - custom search facets
    }

    if (transition === 'disappear') {
      dispatch(assetsListenerDelete(documentId))
    }

    if (transition === 'update') {
      dispatch(assetsListenerUpdate(result as Asset))
    }
  }

  const handleTagUpdate = (update: MutationEvent) => {
    const {documentId, result, transition, type} = update

    if (type !== 'mutation') {
      return
    }

    if (transition === 'appear') {
      dispatch(tagsListenerCreate({...result, name: result?.name?.current} as Tag))
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
      .listen(groq`*[_type == "sanity.imageAsset"]`)
      .subscribe(handleAssetUpdate)

    const subscriptionTag = client //
      .listen(groq`*[_type == "mediaTag"]`)
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

          {/* Items */}
          <Items />

          {/* Debug */}
          <DebugControls />
        </Flex>
      </Card>
    </>
  )
}

export default Browser
