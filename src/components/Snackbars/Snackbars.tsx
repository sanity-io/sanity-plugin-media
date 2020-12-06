import {useToast} from '@sanity/ui'
import {useEffect} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'

const Snackbars = () => {
  const items = useTypedSelector(state => state.snackbars.items)
  const toast = useToast()

  useEffect(() => {
    if (items.length > 0) {
      const lastItem = items[items.length - 1]
      toast.push({
        status: lastItem.kind,
        title: lastItem.title
      })
    }
  }, [items.length])

  return null
  /*
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
  */
}

export default Snackbars
