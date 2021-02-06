import {SelectIcon, SortIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {ORDER_OPTIONS, ORDER_DICTIONARY} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsSetOrder} from '../../modules/assets'

const OrderSelect: FC = () => {
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
          text={order?.title}
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
                  onClick={() => {
                    dispatch(assetsSetOrder(item.field, item.direction))
                  }}
                  padding={2}
                  text={ORDER_DICTIONARY[item.field][item.direction]}
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
