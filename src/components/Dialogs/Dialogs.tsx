import React from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import Box from '../../styled/Box'
import RefsDialog from '../Dialog/Refs'
import ConflictsDialog from '../Dialog/Conflicts'

const Dialogs = () => {
  const {asset, type} = useTypedSelector(state => state.dialog)
  const {byIds} = useTypedSelector(state => state.assets)

  const currentItem = asset && byIds[asset._id]

  if (!currentItem) {
    return null
  }

  return (
    <Box
      alignItems="center"
      bg="rgba(0, 0, 0, 0.9)"
      display="flex"
      justifyContent="center"
      left={0}
      position="fixed"
      size="100%"
      top={0}
      zIndex="modal"
    >
      {asset && type === 'conflicts' && <ConflictsDialog item={currentItem} />}
      {asset && type === 'refs' && <RefsDialog item={currentItem} />}
    </Box>
  )
}

export default Dialogs
