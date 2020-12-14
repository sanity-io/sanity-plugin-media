import {ThLargeIcon, ThListIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Inline, Select, Text} from '@sanity/ui'
import React from 'react'
import {useDispatch} from 'react-redux'

import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsSetView} from '../../modules/assets'

type Props = {}

const ButtonViewGroup = (props: Props) => {
  // Redux
  const dispatch = useDispatch()
  const view = useTypedSelector(state => state.assets.view)

  return (
    <Inline space={0} style={{whiteSpace: 'nowrap'}}>
      <Button
        fontSize={1}
        icon={ThLargeIcon}
        mode={view === 'grid' ? 'default' : 'ghost'}
        onClick={() => dispatch(assetsSetView('grid'))}
        style={{
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0
        }}
      />
      <Button
        fontSize={1}
        icon={ThListIcon}
        mode={view === 'table' ? 'default' : 'ghost'}
        onClick={() => dispatch(assetsSetView('table'))}
        style={{
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 0
        }}
      />
    </Inline>
  )
}

export default ButtonViewGroup
