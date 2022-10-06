import {SelectIcon, SortIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import React from 'react'
import {useDispatch} from 'react-redux'
import {getOrderTitle} from '../../config/orders'
import {ORDER_OPTIONS} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions} from '../../modules/assets'

const OrderSelect = () => {
  // Redux
  const dispatch = useDispatch()
  const order = useTypedSelector(state => state.assets.order)

  return (
    <MenuButton
      button={
        <Button
          fontSize={1}
          icon={SortIcon}
          iconRight={SelectIcon}
          mode="ghost"
          padding={3}
          text={getOrderTitle(order.field, order.direction)}
        />
      }
      id="order"
      menu={
        <Menu>
          {ORDER_OPTIONS?.map((item, index) => {
            if (item) {
              return (
                <MenuItem
                  disabled={order.field === item.field && order.direction === item.direction}
                  fontSize={1}
                  key={index}
                  onClick={() =>
                    dispatch(
                      assetsActions.orderSet({
                        order: {direction: item.direction, field: item.field}
                      })
                    )
                  }
                  padding={2}
                  text={getOrderTitle(item.field, item.direction)}
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
