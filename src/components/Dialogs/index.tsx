import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import DialogDetails from '../DialogDetails'

const Dialogs: FC = () => {
  const {asset, type} = useTypedSelector(state => state.dialog)
  const {byIds} = useTypedSelector(state => state.assets)

  const currentItem = asset && byIds[asset._id]

  if (!currentItem) {
    return null
  }

  if (asset && type === 'details') {
    return <DialogDetails item={currentItem} />
  }

  return null
}

export default Dialogs
