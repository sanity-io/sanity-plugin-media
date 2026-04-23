import {Card, Flex, PortalProvider} from '@sanity/ui'
import {useState} from 'react'
import type {AssetSourceComponentProps, SanityDocument} from 'sanity'

import {AssetBrowserDispatchProvider} from '../../contexts/AssetSourceDispatchContext'
import useVersionedClient from '../../hooks/useVersionedClient'
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

import {useBrowserInit} from './useBrowserInit'

type Props = {
  assetType?: AssetSourceComponentProps['assetType']
  document?: SanityDocument
  onClose?: AssetSourceComponentProps['onClose']
  onSelect?: AssetSourceComponentProps['onSelect']
  schemaType?: AssetSourceComponentProps['schemaType']
  selectedAssets?: AssetSourceComponentProps['selectedAssets']
}

type BrowserContentProps = {
  onClose?: AssetSourceComponentProps['onClose']
  schemaType?: AssetSourceComponentProps['schemaType']
}

const BrowserContent = ({onClose, schemaType}: BrowserContentProps) => {
  const client = useVersionedClient()
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null)

  useBrowserInit(client, schemaType)

  return (
    <PortalProvider element={portalElement}>
      <UploadDropzone>
        <Dialogs />
        <Notifications />

        <Card display="flex" height="fill" ref={setPortalElement}>
          <Flex direction="column" flex={1}>
            <Header onClose={onClose} />
            <Controls />

            <Flex flex={1}>
              <Flex align="flex-end" direction="column" flex={1} style={{position: 'relative'}}>
                <PickedBar />
                <Items />
              </Flex>
              <TagsPanel />
            </Flex>

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
      assetType={props.assetType}
      client={client}
      document={props.document}
      selectedAssets={props.selectedAssets}
    >
      <AssetBrowserDispatchProvider onSelect={props.onSelect} schemaType={props.schemaType}>
        <GlobalStyle />
        <BrowserContent onClose={props.onClose} schemaType={props.schemaType} />
      </AssetBrowserDispatchProvider>
    </ReduxProvider>
  )
}

export default Browser
