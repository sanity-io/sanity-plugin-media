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
        status: lastItem.status,
        title: lastItem.title
      })
    }
  }, [items.length])

  return null
}

export default Snackbars
