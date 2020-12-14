import {Box, Flex} from '@sanity/ui'
import React from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import ButtonViewGroup from '../ButtonViewGroup'
import Filters from '../Filters'
import OrderSelect from '../OrderSelect'
import Progress from '../Progress'
import TextInputSearch from '../TextInputSearch'

const Controls = () => {
  // Redux
  const fetching = useTypedSelector(state => state.assets.fetching)
  const pageIndex = useTypedSelector(state => state.assets.pageIndex)

  return (
    <Box
      paddingY={2}
      style={{
        // background: 'lime',
        borderBottom: '1px solid #333' // TODO: use theme colors
      }}
    >
      {/* Rows: search / filters / orders  */}
      <Box>
        <Flex
          align="flex-start"
          direction={['column', 'column', 'column', 'column', 'row']}
          justify="space-between"
        >
          {/* Search + Filters */}
          <Flex
            flex={1}
            style={{
              alignItems: 'flex-start',
              // background: 'yellow',
              // alignItems: 'center',
              // border: '2px solid red',
              height: '100%',
              justifyContent: 'flex-start',
              position: 'relative',
              width: '100%'
            }}
          >
            <Box
              marginX={2}
              style={{
                minWidth: '200px'
              }}
            >
              {/* Search */}
              <TextInputSearch />
            </Box>

            {/* Filters */}
            <Filters />
          </Flex>

          {/* Views + filters + orders*/}
          <Box marginTop={[2, 2, 2, 2, 0]}>
            <Flex
              align="center"
              justify={[
                'space-between',
                'space-between',
                'space-between',
                'space-between',
                'flex-end'
              ]}
              style={
                {
                  // background: 'orangered'
                }
              }
            >
              {/* View buttons */}
              <Box marginX={2}>
                <ButtonViewGroup />
              </Box>

              {/* Order select */}
              <Box marginX={2}>
                <OrderSelect />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* Progress bar */}
      <Progress key={pageIndex} loading={fetching} />
    </Box>
  )
}

export default Controls
