import React from 'react'
import {useSelector as useReduxSelector, TypedUseSelectorHook} from 'react-redux'
import {RootReducerState} from '../../modules/types'
import RefsDialog from '../Dialog/Refs'
import ConflictsDialog from '../Dialog/Conflicts'

const Dialogs = () => {
  const useSelector: TypedUseSelectorHook<RootReducerState> = useReduxSelector

  const {asset, type} = useSelector(state => state.dialog)
  const {byIds} = useSelector(state => state.assets)

  const currentItem = asset && byIds[asset._id]

  if (!currentItem) {
    return null
  }

  if (asset && type === 'conflicts') {
    return <ConflictsDialog item={currentItem} />
  }

  if (asset && type === 'refs') {
    return <RefsDialog item={currentItem} />
  }

  return null
}

export default Dialogs
