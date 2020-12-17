import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import DialogDetails from '../DialogDetails'
import DialogSearchFacets from '../DialogSearchFacets'

const Dialogs: FC = () => {
  // Redux
  const {asset, type} = useTypedSelector(state => state.dialog)
  const {byIds} = useTypedSelector(state => state.assets)

  const currentItem = asset && byIds[asset._id]

  if (type === 'details' && currentItem) {
    return <DialogDetails item={currentItem} />
  }

  if (type === 'searchFacets') {
    return <DialogSearchFacets />
  }

  return null
}

export default Dialogs
