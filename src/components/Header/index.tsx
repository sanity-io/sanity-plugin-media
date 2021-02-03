import {CloseIcon, Icon} from '@sanity/icons'
import {Box, Button, Flex, Text} from '@sanity/ui'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'

type Props = {
  onClose?: () => void
}

const Header: FC<Props> = (props: Props) => {
  const {onClose} = props

  // Redux
  const currentDocument = useTypedSelector(state => state.document)

  // Row: Current document / close button
  return (
    <Box paddingY={2}>
      <Flex align="center" justify="space-between">
        {/* Label */}
        <Box flex={1} marginX={3}>
          <Text textOverflow="ellipsis" weight="semibold">
            <span>{currentDocument ? 'Insert Image' : 'Browse Assets'}</span>
            {currentDocument && (
              <>
                <span
                  style={{
                    margin: '0 0.5em'
                  }}
                >
                  <Icon symbol="arrow-right" />
                </span>
                <span
                  style={{
                    textTransform: 'capitalize'
                  }}
                >
                  {currentDocument._type}
                </span>
              </>
            )}
          </Text>
        </Box>

        {/* Close */}
        <Box
          marginX={3}
          style={{
            flexShrink: 0
          }}
        >
          <Button
            disabled={!onClose}
            icon={CloseIcon}
            mode="bleed"
            onClick={onClose}
            radius={2}
            style={{
              opacity: onClose ? 1 : 0
            }}
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default Header
