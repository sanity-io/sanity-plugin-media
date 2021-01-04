import {Card, Flex} from '@sanity/ui'
import React, {FC, useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {DEBUG_MODE} from '../../config'
import {assetsLoadPageIndex} from '../../modules/assets'
import Controls from '../Controls'
import DebugControls from '../DebugControls'
import Dialogs from '../Dialogs'
import Header from '../Header'
import Items from '../Items'
import Notifications from '../Notifications'

type Props = {
  onClose?: () => void
}

const Browser: FC<Props> = (props: Props) => {
  const {onClose} = props

  // Redux
  const dispatch = useDispatch()

  // Fetch items on mount
  useEffect(() => {
    dispatch(assetsLoadPageIndex(0))
  }, [])

  return (
    <>
      <Notifications />
      <Dialogs />

      <Card
        scheme="dark"
        style={{
          height: '100%',
          minHeight: '100%'
        }}
      >
        <Flex
          direction="column"
          style={{
            height: '100%',
            minHeight: '100%'
          }}
        >
          {/* Header */}
          <Header onClose={onClose} />

          {/* Browser Controls */}
          <Controls />

          {/* Items */}
          <Items />

          {/* Debug */}
          {DEBUG_MODE && <DebugControls />}
        </Flex>
      </Card>
    </>
  )
}

export default Browser
