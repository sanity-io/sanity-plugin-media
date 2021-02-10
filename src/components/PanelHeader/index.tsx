import {black, hues} from '@sanity/color'
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
        background: black.hex,
        borderBottom: `1px solid ${hues.gray?.[900].hex}`,
        height: '2.0em',
        position: 'sticky',
        top: 0,
        // HACK: specify z-index to circumvent issue with @sanity/ui <Text> and <Button>
        // components appearing above sticky elements
        zIndex: 1
      }}
    >
      {children}
    </Flex>
  )
}

export default PanelHeader
