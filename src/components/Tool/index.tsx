import {Flex} from '@sanity/ui'
import React, {ComponentProps} from 'react'
import Browser from '../Browser'
import {ToolOptionsProvider} from '../../contexts/ToolOptionsContext'
import {Tool as SanityTool} from 'sanity'
import {MediaToolOptions} from '@types'

const Tool = ({tool: {options}}: ComponentProps<SanityTool<MediaToolOptions>['component']>) => {
  return (
    <ToolOptionsProvider options={options}>
      <Flex direction="column" height="fill" flex={1}>
        <Browser />
      </Flex>
    </ToolOptionsProvider>
  )
}

export default Tool
