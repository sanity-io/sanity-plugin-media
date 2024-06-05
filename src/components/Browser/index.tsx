import type {MutationEvent} from '@sanity/client'
import {Card, Flex} from '@sanity/ui'
import {Asset, Tag} from '@types'
import groq from 'groq'
import React, {useEffect} from 'react'
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

const Browser = (props: Props) => {
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
    console.log("handleTags")

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

    const tagsRefs = {
      us: "2yXnm4mew8QvsGqhdMhYHY",
      br: "L9kJ2ltVJF2K9EcyKNB9pV",
      ua: "9q4DLwlx4GaCDdOE1fIe3s",
      gb: "ISMpGAlllEDUeg1EmZjul4",
      co: "ISMpGAlllEDUeg1EmZjuyX",
      de: "ISMpGAlllEDUeg1EmZjv6c",
      ar: "9q4DLwlx4GaCDdOE1fIdsV",
      tr: "NlvmxH0U7Vz33q3WYVbACf",
      ae: "QFupi900N8MGZiKkhuHeFl",
      ca: "QFupi900N8MGZiKkhuHeKG",
      za: "oabqLdliTwd35fNcGPgsut",
      au: "oabqLdliTwd35fNcGPgtJP",
      id: "oabqLdliTwd35fNcGPgtY7",
      mx: "oabqLdliTwd35fNcGPgtmp",
      cl: "xsFDdtCGs1CGERgpfPehEc",
    }

    const market = process.env["SANITY_STUDIO_MARKET"] ? process.env["SANITY_STUDIO_MARKET"] : "";
    console.log("market plugin", market)

    // Listen for asset and tag changes in published documents.
    // Remember that Sanity listeners ignore joins, order clauses and projections!
    // Also note that changes to the selected document (if present) will automatically re-load the media plugin
    // due to the desk pane re-rendering.
    // @ts-ignore
    const subscriptionAsset = client.listen(groq`*[_type in ["sanity.fileAsset", "sanity.imageAsset"] && count(opt.media.tags[(_ref == "${tagsRefs[market]}")]) > 0 && !(_id in path("drafts.**"))]`).subscribe(handleAssetUpdate)
    // @ts-ignore
    const subscriptionTag = client.listen(groq`*[_type == "${TAG_DOCUMENT_NAME}" && count(opt.media.tags[(_ref == "${tagsRefs[market]}")]) > 0 &&  !(_id in path("drafts.**"))]`).subscribe(handleTagUpdate)

    return () => {
      subscriptionAsset?.unsubscribe()
      subscriptionTag?.unsubscribe()
    }
  }, [])

  return (
      <UploadDropzone>
        <Dialogs/>
        <Notifications/>

        <Card display="flex" height="fill">
          <Flex direction="column" flex={1}>
            {/* Header */}
            <Header onClose={onClose}/>

            {/* Browser Controls */}
            <Controls/>

            <Flex flex={1}>
              <Flex align="flex-end" direction="column" flex={1} style={{position: 'relative'}}>
                <PickedBar/>
                <Items/>
              </Flex>
              <TagsPanel/>
            </Flex>

            {/* Debug */}
            <DebugControls/>
          </Flex>
        </Card>
      </UploadDropzone>
  )
}

export default Browser
