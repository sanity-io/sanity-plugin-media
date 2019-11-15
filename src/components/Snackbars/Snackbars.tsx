import React from 'react'
import {useSelector as useReduxSelector, TypedUseSelectorHook} from 'react-redux'
import Snackbar from 'part:@sanity/components/snackbar/default'

import {RootReducerState} from '../../modules/types'

const Snackbars = () => {
  const useSelector: TypedUseSelectorHook<RootReducerState> = useReduxSelector

  const items = useSelector(state => state.snackbars.items)

  return (
    <div>
      {items &&
        items.map(item => {
          const {id, kind, subtitle, timeout, title} = item
          return (
            <Snackbar key={id} kind={kind} subtitle={subtitle} timeout={timeout} title={title} />
          )
        })}
    </div>
  )
}

export default Snackbars
