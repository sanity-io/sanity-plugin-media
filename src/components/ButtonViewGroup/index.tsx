import {ThLargeIcon, ThListIcon} from '@sanity/icons'
import {Button, Inline} from '@sanity/ui'
import React from 'react'
import {useDispatch} from 'react-redux'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions} from '../../modules/assets'

const ButtonViewGroup = () => {
  // Redux
  const dispatch = useDispatch()
  const view = useTypedSelector(state => state.assets.view)

  return (
    <Inline space={0} style={{whiteSpace: 'nowrap'}}>
      <Button
        fontSize={1}
        icon={ThLargeIcon}
        mode={view === 'grid' ? 'default' : 'ghost'}
        onClick={() => dispatch(assetsActions.viewSet({view: 'grid'}))}
        style={{
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0
        }}
      />
      <Button
        fontSize={1}
        icon={ThListIcon}
        mode={view === 'table' ? 'default' : 'ghost'}
        onClick={() => dispatch(assetsActions.viewSet({view: 'table'}))}
        style={{
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 0
        }}
      />
    </Inline>
  )
}

export default ButtonViewGroup
