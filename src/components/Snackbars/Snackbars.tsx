import Snackbar from 'part:@sanity/components/snackbar/default'
import React from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'

const Snackbars = () => {
  const items = useTypedSelector(state => state.snackbars.items)

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
