import {CloseIcon, Icon, ThLargeIcon, ThListIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Inline, Select, Text} from '@sanity/ui'
import React, {ChangeEvent} from 'react'
import {useDispatch} from 'react-redux'
import {Flex as LegacyFlex} from 'theme-ui'

import {ORDERS} from '../../config'
import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsSetFilter, assetsSetOrder, assetsSetView} from '../../modules/assets'
import Progress from '../Progress'
import TextInputSearch from '../TextInputSearch'

type Props = {
  onClose?: () => void
}

const Header = (props: Props) => {
  const {onClose} = props

  // Redux
  const dispatch = useDispatch()
  const currentDocument = useTypedSelector(state => state.document)
  const fetching = useTypedSelector(state => state.assets.fetching)
  const view = useTypedSelector(state => state.assets.view)
  const filters = useTypedSelector(state => state.assets.filters)
  const pageIndex = useTypedSelector(state => state.assets.pageIndex)

  return (
    <Box
      style={{
        position: 'absolute',
        top: 0,
        width: '100%'
      }}
    >
      {/* Row: Current document / close button */}
      <Card>
        <LegacyFlex
          sx={{
            alignItems: 'center',
            height: 'headerRowHeight1x',
            justifyContent: 'space-between',
            textAlign: 'left',
            width: '100%'
          }}
        >
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
          {onClose && (
            <Box marginX={3}>
              <Button icon={CloseIcon} mode="bleed" onClick={onClose} radius={0} />
            </Box>
          )}
        </LegacyFlex>
      </Card>

      {/* Rows: search / filters / orders  */}
      <Card>
        <LegacyFlex
          sx={{
            alignItems: ['flex-start', 'center'],
            flexDirection: ['column', 'row'],
            height: ['headerRowHeight2x', 'headerRowHeight1x'],
            justifyContent: 'space-between',
            textAlign: 'right',
            width: '100%'
          }}
        >
          {/* Search */}
          <LegacyFlex
            sx={{
              alignItems: 'center',
              flexGrow: 1,
              height: '100%',
              justifyContent: 'flex-start',
              maxWidth: ['none', '340px'],
              position: 'relative',
              width: '100%'
            }}
          >
            <Box flex={1} marginX={2}>
              <TextInputSearch />
            </Box>
          </LegacyFlex>

          {/* Views + filters + orders*/}
          <LegacyFlex
            sx={{
              alignItems: 'center',
              height: '100%',
              justifyContent: ['space-between', 'flex-end'],
              width: '100%'
            }}
          >
            <Flex>
              <Box marginX={2}>
                <Inline
                  space={0}
                  style={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Button
                    fontSize={1}
                    icon={ThLargeIcon}
                    mode={view === 'grid' ? 'default' : 'ghost'}
                    onClick={() => dispatch(assetsSetView('grid'))}
                    radius={0}
                  />
                  <Button
                    fontSize={1}
                    icon={ThListIcon}
                    mode={view === 'table' ? 'default' : 'ghost'}
                    onClick={() => dispatch(assetsSetView('table'))}
                    radius={0}
                  />
                </Inline>
              </Box>
            </Flex>

            <Box marginX={2}>
              <Inline
                style={{
                  whiteSpace: 'nowrap'
                }}
              >
                <Select
                  fontSize={1}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const selectedIndex = e.target.selectedIndex
                    const filter = filters?.[selectedIndex]
                    if (filter) {
                      dispatch(assetsSetFilter(filter))
                    }
                  }}
                  padding={3}
                >
                  {filters?.map((item, index) => {
                    return (
                      <option key={index} value={item.value}>
                        {item.title}
                      </option>
                    )
                  })}
                </Select>

                {/* Order select */}
                <Inline>
                  <Box marginX={3}>
                    <Text size={1}>
                      <Icon symbol="sort" />
                    </Text>
                  </Box>
                  <Select
                    fontSize={1}
                    radius={1}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const selectedIndex = e.target.selectedIndex
                      const value = ORDERS[selectedIndex]
                      dispatch(assetsSetOrder(value))
                    }}
                    padding={3}
                  >
                    {ORDERS?.map((item, index) => {
                      return (
                        <option key={index} value={item.value}>
                          {item.title}
                        </option>
                      )
                    })}
                  </Select>
                </Inline>
              </Inline>
            </Box>
          </LegacyFlex>
        </LegacyFlex>
      </Card>

      {/* Progress bar */}
      <Progress key={pageIndex} loading={fetching} />
    </Box>
  )
}

export default Header
