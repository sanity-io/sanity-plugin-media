import {Card, Flex} from '@sanity/ui'
import React, {FC, useEffect} from 'react'
import {useDispatch} from 'react-redux'
// import styled from 'styled-components'

import {
  // assetsLoadNextPage,
  assetsLoadPageIndex
} from '../../modules/assets'
import Controls from '../Controls'
import Dialogs from '../Dialogs'
import Header from '../Header'
import Items from '../Items'
import Snackbars from '../Snackbars'

type Props = {
  onClose?: () => void
}

/*
const CustomThing = styled.div(({theme}) => {
  console.log(theme.sanity)
  return {}
})
*/

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
      <Snackbars />
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
        </Flex>
      </Card>
    </>
  )
}

export default Browser
