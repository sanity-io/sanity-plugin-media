import React from 'react'
import {PortalProvider, ThemeProvider, ToastProvider, studioTheme} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {AssetSourceComponentProps, SanityDocument, useColorScheme, useFormValue} from 'sanity'
import {AssetBrowserDispatchProvider} from '../../contexts/AssetSourceDispatchContext'
import useKeyPress from '../../hooks/useKeyPress'
import useVersionedClient from '../../hooks/useVersionedClient'
import GlobalStyle from '../../styled/GlobalStyles'
import ReduxProvider from '../ReduxProvider'
import {useDispatch} from 'react-redux'
import {assetsActions} from '../../modules/assets'
import {dialogActions} from '../../modules/dialog'
import constructFilter from '../../utils/constructFilter'
import Dialogs from '../Dialogs'

/**
 * Dialog for editing a single asset
 */
const EditAssetDialog = (props: AssetSourceComponentProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const constructedFilter = constructFilter({
      assetTypes: ['file', 'image'],
      searchFacets: []
    })
    const params = {
      documentId: props.selectedAssets[0]?._id
    }
    dispatch(
      assetsActions.fetchRequest({
        params,
        queryFilter: constructedFilter
      })
    )
    dispatch(dialogActions.showAssetEdit({assetId: props.selectedAssets[0]._id}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Dialogs />
}

const EditAssetTool = (props: AssetSourceComponentProps) => {
  const {onClose} = props

  const portalElement = useRootPortalElement()

  // Get current Sanity document
  const currentDocument = useFormValue([]) as SanityDocument

  // Close on escape key press
  useKeyPress('escape', onClose)

  const client = useVersionedClient()
  const {scheme} = useColorScheme()

  return (
    <ReduxProvider
      assetType={props?.assetType}
      client={client}
      document={currentDocument}
      selectedAssets={props?.selectedAssets}
    >
      <ThemeProvider scheme={scheme} theme={studioTheme}>
        <ToastProvider>
          <AssetBrowserDispatchProvider onSelect={props?.onSelect}>
            <GlobalStyle />
            <PortalProvider element={portalElement}>
              <EditAssetDialog {...props} />
            </PortalProvider>
          </AssetBrowserDispatchProvider>
        </ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default EditAssetTool

const useRootPortalElement = () => {
  const [container] = useState(() => document.createElement('div'))

  useEffect(() => {
    container.classList.add('media-portal')
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [container])

  return container
}
