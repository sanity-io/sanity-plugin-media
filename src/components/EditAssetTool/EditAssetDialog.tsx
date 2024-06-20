import React from 'react'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {AssetSourceComponentProps} from 'sanity'
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

export default EditAssetDialog
