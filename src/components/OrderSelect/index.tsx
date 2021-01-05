import {SelectIcon, SortIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {BROWSER_SELECT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsSetOrder} from '../../modules/assets'

const OrderSelect: FC = () => {
  // Redux
  const dispatch = useDispatch()
  const order = useTypedSelector(state => state.assets.order)

  const selectedOrder = BROWSER_SELECT.find(
    v => v?.order.field === order.field && v?.order.direction === order.direction
  )

  return (
    <MenuButton
      button={
        <Button
          fontSize={1}
          icon={SortIcon}
          iconRight={SelectIcon}
          mode="ghost"
          padding={3}
          style={{margin: '0 4px'}}
          text={selectedOrder?.title}
        />
      }
      id="order"
      menu={
        <Menu>
          {BROWSER_SELECT?.map((item, index) => {
            if (item) {
              return (
                <MenuItem
                  disabled={
                    order.field === item.order.field && order.direction === item.order.direction
                  }
                  fontSize={1}
                  key={index}
                  onClick={() => {
                    dispatch(assetsSetOrder(item.order))
                  }}
                  padding={2}
                  text={item.title}
                />
              )
            }

            return <MenuDivider key={index} />
          })}
        </Menu>
      }
    />
  )
}

export default OrderSelect
