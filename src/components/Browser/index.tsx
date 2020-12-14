import {Card, Flex} from '@sanity/ui'
import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import {
  // assetsLoadNextPage,
  assetsLoadPageIndex
} from '../../modules/assets'
import Dialogs from '../Dialogs'
import Controls from '../Controls'
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

const Browser = (props: Props) => {
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
        {/* <CustomThing /> */}

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
