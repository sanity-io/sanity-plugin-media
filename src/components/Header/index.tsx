import {CloseIcon, Icon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Text} from '@sanity/ui'
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
        <Box marginX={3}>
          <Inline space={2}>
            <Text weight="semibold">{currentDocument ? 'Insert Media' : 'Browse Media'}</Text>
            {currentDocument && (
              <Text>
                <Icon symbol="arrow-right" />
              </Text>
            )}
            {currentDocument && (
              <Text
                style={{
                  textTransform: 'capitalize'
                }}
              >
                {currentDocument._type}
              </Text>
            )}
          </Inline>
        </Box>

        {/* Close */}
        <Box marginX={3}>
          <Button
            disabled={!onClose}
            icon={CloseIcon}
            mode="bleed"
            onClick={onClose}
            radius={0}
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
