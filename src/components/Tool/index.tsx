import {Flex} from '@sanity/ui'
import React from 'react'
import Browser from '../Browser'

const Tool = () => {
  return (
    <Flex direction="column" height="fill" flex={1}>
      <Browser />
    </Flex>
  )
}

export default Tool
