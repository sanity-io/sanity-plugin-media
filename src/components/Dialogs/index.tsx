import React from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import DialogRefs from '../DialogRefs'

const Dialogs = () => {
  const {asset, type} = useTypedSelector(state => state.dialog)
  const {byIds} = useTypedSelector(state => state.assets)

  const currentItem = asset && byIds[asset._id]

  if (!currentItem) {
    return null
  }

  if (asset && type === 'refs') {
    return <DialogRefs item={currentItem} />
  }

  return null
}

export default Dialogs
