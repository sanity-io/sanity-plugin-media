import {PlugIcon} from '@sanity/icons'
import {Box, Card, Flex, Switch, Text, Tooltip} from '@sanity/ui'
import React, {ChangeEvent, FC} from 'react'
import {useDispatch} from 'react-redux'

import useTypedSelector from '../../hooks/useTypedSelector'
import {debugSetBadConnection} from '../../modules/debug'

const DebugControls: FC = () => {
  // Redux
  const dispatch = useDispatch()
  const badConnection = useTypedSelector(state => state.debug.badConnection)

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    dispatch(debugSetBadConnection(checked))
  }

  return (
    <Box
      padding={4}
      style={{
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        width: '100%'
      }}
    >
      {/* Bad connection toggle */}
      <Flex align="center">
        <Box marginRight={3}>
          <Text muted size={1}>
            <PlugIcon />
          </Text>
        </Box>
        <Tooltip
          content={
            <Card padding={2}>
              <Text muted size={1}>
                {badConnection
                  ? 'Bad connection: +2000ms & 50% chance to fail'
                  : 'No connection throttling'}
              </Text>
            </Card>
          }
          fallbackPlacements={['right', 'left']}
          placement="bottom"
        >
          <Switch
            checked={badConnection}
            onChange={handleChange}
            style={{
              pointerEvents: 'auto'
            }}
          />
        </Tooltip>
      </Flex>
    </Box>
  )
}

export default DebugControls
