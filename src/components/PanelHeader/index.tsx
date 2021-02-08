import {Flex} from '@sanity/ui'
import React, {FC, ReactNode} from 'react'

type Props = {
  children: ReactNode
}

const PanelHeader: FC<Props> = (props: Props) => {
  const {children} = props

  return (
    <Flex
      align="center"
      justify="space-between"
      paddingLeft={3}
      style={{
        background: '#0F1112', // TODO: use theme colors
        borderBottom: '1px solid #333', // TODO: use theme colors
        height: '2.0em'
        // position: 'sticky',
        // top: 0
        // zIndex: 1
      }}
    >
      {children}
    </Flex>
  )
}

export default PanelHeader
