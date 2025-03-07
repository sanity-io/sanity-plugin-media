import type {MutationEvent} from '@sanity/client'
import {Card, Flex, PortalProvider} from '@sanity/ui'
import type {Asset, Tag} from '../../types'
import groq from 'groq'
import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {type AssetSourceComponentProps, type SanityDocument} from 'sanity'
import {TAG_DOCUMENT_NAME} from '../../constants'
import {AssetBrowserDispatchProvider} from '../../contexts/AssetSourceDispatchContext'
import useVersionedClient from '../../hooks/useVersionedClient'
import {assetsActions} from '../../modules/assets'
import {tagsActions} from '../../modules/tags'
import GlobalStyle from '../../styled/GlobalStyles'
import Controls from '../Controls'
import DebugControls from '../DebugControls'
import Dialogs from '../Dialogs'
import Header from '../Header'
import Items from '../Items'
import Notifications from '../Notifications'
import PickedBar from '../PickedBar'
import ReduxProvider from '../ReduxProvider'
import TagsPanel from '../TagsPanel'
import UploadDropzone from '../UploadDropzone'

type Props = {
  assetType?: AssetSourceComponentProps['assetType']
  document?: SanityDocument
  onClose?: AssetSourceComponentProps['onClose']
  onSelect?: AssetSourceComponentProps['onSelect']
  selectedAssets?: AssetSourceComponentProps['selectedAssets']
}

const BrowserContent = ({onClose}: {onClose?: AssetSourceComponentProps['onClose']}) => {
  const client = useVersionedClient()
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
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
  }, [client, dispatch])

  return (
    <PortalProvider element={portalElement}>
      <UploadDropzone>
        <Dialogs />
        <Notifications />

        <Card display="flex" height="fill" ref={setPortalElement}>
          <Flex direction="column" flex={1}>
            {/* Header */}
            <Header onClose={onClose} />

            {/* Browser Controls */}
            <Controls />

            <Flex flex={1}>
              <Flex align="flex-end" direction="column" flex={1} style={{position: 'relative'}}>
                <PickedBar />
                <Items />
              </Flex>
              <TagsPanel />
            </Flex>

            {/* Debug */}
            <DebugControls />
          </Flex>
        </Card>
      </UploadDropzone>
    </PortalProvider>
  )
}

const Browser = (props: Props) => {
  const client = useVersionedClient()

  return (
    <ReduxProvider
      assetType={props?.assetType}
      client={client}
      document={props?.document}
      selectedAssets={props?.selectedAssets}
    >
      <AssetBrowserDispatchProvider onSelect={props?.onSelect}>
        <GlobalStyle />
        <BrowserContent onClose={props?.onClose} />
      </AssetBrowserDispatchProvider>
    </ReduxProvider>
  )
}

export default Browser
