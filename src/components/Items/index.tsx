import {Box, Text} from '@sanity/ui'
import React, {FC, Ref, useRef} from 'react'
import {useDispatch} from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import {ListOnItemsRenderedProps, GridOnItemsRenderedProps} from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import useResizeObserver from '../../hooks/useResizeObserver'

import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsLoadNextPage} from '../../modules/assets'
import Cards from '../Cards'
import PickedBar from '../PickedBar'
import Table from '../Table'

type InfiniteLoaderRenderProps = {
  onItemsRendered: (props: ListOnItemsRenderedProps) => any
  ref: Ref<any>
}

const Items: FC = () => {
  // Ref used to scroll to the top of the page on filter changes
  const viewRef = useRef<HTMLDivElement | null>(null)

  // Redux
  const dispatch = useDispatch()
  const allIds = useTypedSelector(state => state.assets.allIds)
  const byIds = useTypedSelector(state => state.assets.byIds)
  const fetchCount = useTypedSelector(state => state.assets.fetchCount)
  const fetching = useTypedSelector(state => state.assets.fetching)
  const pageSize = useTypedSelector(state => state.assets.pageSize)
  const view = useTypedSelector(state => state.assets.view)

  const items = allIds.map(id => byIds[id])

  // const hasFetchedOnce = totalCount >= 0
  const hasFetchedOnce = fetchCount >= 0
  const hasItems = items.length > 0

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: number) => {
    return index < items.length
  }

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const handleLoadMoreItems = () => {
    if (!fetching) {
      dispatch(assetsLoadNextPage())
    }
    return new Promise(() => {})
  }

  // NOTE: The below is a workaround and can be inaccurate in certain cases.
  // e.g. if `pageSize` is 10 and you have fetched 10 items, `hasMore` will still be true
  // and another fetch will invoked on next page (which will return 0 items).
  // This is currently how the default asset source in Sanity works.
  // TODO: When it's performant enough to get total asset count across large datasets, revert
  // to using `totalCount` across the board.
  const hasMore = fetchCount === pageSize
  // const hasMore = (pageIndex + 1) * pageSize < totalCount

  // If there are more items to be loaded then add an extra placeholder row to trigger additional page loads.
  const itemCount = hasMore ? items.length + 1 : items.length

  // TODO: DRY
  const picked = items.filter(item => item.picked)
  const hasPicked = picked.length > 0

  const isEmpty = !hasItems && hasFetchedOnce && !fetching

  const {ref, height: containerHeight} = useResizeObserver()

  if (isEmpty) {
    return (
      <Box padding={4}>
        <Text size={1} weight="semibold">
          No results for the current query
        </Text>
      </Box>
    )
  }

  return (
    <Box
      flex={1}
      ref={viewRef}
      style={{
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Picked bar */}
      <div ref={ref}>{hasPicked && <PickedBar />}</div>

      {(view === 'grid' || 'table') && (
        <AutoSizer>
          {({height, width}) => {
            return (
              <>
                <InfiniteLoader
                  isItemLoaded={isItemLoaded}
                  itemCount={itemCount}
                  loadMoreItems={handleLoadMoreItems}
                >
                  {({onItemsRendered, ref}: InfiniteLoaderRenderProps) => {
                    // View: Table
                    if (view === 'table') {
                      return (
                        <Table
                          height={height - (containerHeight ?? 0)}
                          items={items}
                          itemCount={itemCount}
                          onItemsRendered={onItemsRendered}
                          ref={ref}
                          width={width}
                        />
                      )
                    }

                    // View: Grid
                    if (view === 'grid') {
                      // The `onItemsRendered` method signature for `react-window` grids is different and
                      // requires an adaptor, below.
                      // Source: https://github.com/bvaughn/react-window-infinite-loader/issues/3
                      const newItemsRendered = (gridData: GridOnItemsRenderedProps) => {
                        const {
                          overscanRowStartIndex,
                          overscanRowStopIndex,
                          overscanColumnStopIndex
                        } = gridData

                        const endCol = overscanColumnStopIndex + 1
                        const startRow = overscanRowStartIndex
                        const endRow = overscanRowStopIndex
                        const visibleStartIndex = startRow * endCol
                        const visibleStopIndex = endRow * endCol

                        onItemsRendered({
                          overscanStartIndex: visibleStartIndex - 10,
                          overscanStopIndex: visibleStopIndex + 10,
                          visibleStartIndex,
                          visibleStopIndex
                        })
                      }

                      return (
                        <Cards
                          height={height - (containerHeight ?? 0)}
                          items={items}
                          itemCount={itemCount}
                          onItemsRendered={newItemsRendered}
                          ref={ref}
                          width={width}
                        />
                      )
                    }
                  }}
                </InfiniteLoader>
              </>
            )
          }}
        </AutoSizer>
      )}
    </Box>
  )
}

export default Items
