import {ChevronDownIcon, ChevronUpIcon} from '@sanity/icons'
import {Box, Label} from '@sanity/ui'
import React from 'react'
import {useDispatch} from 'react-redux'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions} from '../../modules/assets'

type Props = {
  field?: string
  title?: string
}

const TableHeaderItem = (props: Props) => {
  const {field, title} = props

  // Redux
  const dispatch = useDispatch()
  const order = useTypedSelector(state => state.assets.order)

  const isActive = order.field === field

  // Callbacks
  const handleClick = () => {
    if (!field || !title) {
      return
    }

    if (isActive) {
      const direction = order.direction === 'asc' ? 'desc' : 'asc'
      dispatch(assetsActions.orderSet({order: {field, direction}}))
    } else {
      dispatch(assetsActions.orderSet({order: {field, direction: 'asc'}}))
    }
  }

  return (
    <Label muted={!field} size={0}>
      <Box
        onClick={field ? handleClick : undefined}
        style={{
          cursor: field ? 'pointer' : 'default',
          display: 'inline',
          whiteSpace: 'nowrap'
        }}
      >
        <span
          style={{
            marginRight: '0.4em'
          }}
        >
          {title}
        </span>

        {isActive && order?.direction === 'asc' && <ChevronUpIcon />}
        {isActive && order?.direction === 'desc' && <ChevronDownIcon />}
      </Box>
    </Label>
  )
}

export default TableHeaderItem
