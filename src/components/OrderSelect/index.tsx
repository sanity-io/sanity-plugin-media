import {SortIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {useDispatch} from 'react-redux'
import {getOrderTitle} from '../../config/orders'
import {ORDER_OPTIONS} from '../../constants'
import {usePortalPopoverProps} from '../../hooks/usePortalPopoverProps'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions} from '../../modules/assets'

const OrderSelect = () => {
  // Redux
  const dispatch = useDispatch()
  const order = useTypedSelector(state => state.assets.order)

  const popoverProps = usePortalPopoverProps()

  return (
    <MenuButton
      button={
        <Button
          fontSize={1}
          icon={SortIcon}
          mode="bleed"
          padding={3}
          text={getOrderTitle(order.field, order.direction)}
        />
      }
      id="order"
      menu={
        <Menu>
          {ORDER_OPTIONS?.map((item, index) => {
            if (item) {
              const selected = order.field === item.field && order.direction === item.direction
              return (
                <MenuItem
                  disabled={selected}
                  fontSize={1}
                  iconRight={selected}
                  key={index}
                  onClick={() =>
                    dispatch(
                      assetsActions.orderSet({
                        order: {direction: item.direction, field: item.field}
                      })
                    )
                  }
                  padding={2}
                  selected={selected}
                  space={4}
                  style={{minWidth: '200px'}}
                  text={getOrderTitle(item.field, item.direction)}
                />
              )
            }

            return <MenuDivider key={index} />
          })}
        </Menu>
      }
      popover={popoverProps}
    />
  )
}

export default OrderSelect
