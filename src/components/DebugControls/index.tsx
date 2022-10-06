import {PlugIcon} from '@sanity/icons'
import {Box, Flex, Switch, Text, Tooltip} from '@sanity/ui'
import React, {ChangeEvent} from 'react'
import {useDispatch} from 'react-redux'
import useKeyPress from '../../hooks/useKeyPress'
import useTypedSelector from '../../hooks/useTypedSelector'
import {debugActions} from '../../modules/debug'

const DebugControls = () => {
  // Redux
  const dispatch = useDispatch()
  const badConnection = useTypedSelector(state => state.debug.badConnection)
  const debugEnabled = useTypedSelector(state => state.debug.enabled)

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    dispatch(debugActions.setBadConnection(checked))
  }

  const handleToggleControls = () => {
    dispatch(debugActions.toggleEnabled())
  }

  // Close on escape key press
  useKeyPress('alt+ctrl+shift+/', handleToggleControls)

  if (!debugEnabled) {
    return null
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
            <Box padding={2}>
              <Text muted size={1}>
                {badConnection
                  ? 'Bad connection: +3000ms & 50% chance to fail'
                  : 'No connection throttling'}
              </Text>
            </Box>
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
