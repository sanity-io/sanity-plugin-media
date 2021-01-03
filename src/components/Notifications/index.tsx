import {useToast} from '@sanity/ui'
import {FC, useEffect} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'

const Notifications: FC = () => {
  const items = useTypedSelector(state => state.notifications.items)
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

export default Notifications
