import {Asset} from '@types'
import React, {Ref, useRef, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import {ListOnItemsRenderedProps, GridOnItemsRenderedProps} from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsLoadNextPage, assetsLoadPageIndex} from '../../modules/assets'
import Box from '../../styled/Box'
import Dialogs from '../Dialogs/Dialogs'
// import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import Snackbars from '../Snackbars/Snackbars'
import CardView from '../View/Card'
import TableView from '../View/Table'

type Props = {
  onClose?: () => void
  selectedAssets?: Asset[]
}

type InfiniteLoaderRenderProps = {
  onItemsRendered: (props: ListOnItemsRenderedProps) => any
  ref: Ref<any>
}

const Browser = (props: Props) => {
  const {onClose, selectedAssets} = props

  // Ref used to scroll to the top of the page on filter changes
  const viewRef = useRef<HTMLDivElement | null>(null)

  // Redux
  const dispatch = useDispatch()
  const {
    allIds,
    byIds,
    fetchCount,
    fetching,
    pageSize,
    // pageIndex,
    view
    // totalCount
  } = useTypedSelector(state => state.assets)

  const items = allIds.map(id => byIds[id])

  // const hasFetchedOnce = totalCount >= 0
  const hasFetchedOnce = fetchCount >= 0
  const hasItems = items.length > 0
  const picked = items.filter(item => item.picked)
  const hasPicked = picked.length > 0

  // Fetch items on mount
  useEffect(() => {
    dispatch(assetsLoadPageIndex(0))
  }, [])

  // NOTE: The below is a workaround and can be inaccurate in certain cases.
  // e.g. if `pageSize` is 10 and you have fetched 10 items, `hasMore` will still be true
  // and another fetch will invoked on next page (which will return 0 items).
  // This is currently how the default asset source in Sanity works.
  // TODO: When it's performant enough to get total asset count across large datasets, revert
  // to using `totalCount` across the board.
  const hasMore = fetchCount === pageSize
  // const hasMore = (pageIndex + 1) * pageSize < totalCount

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

  // If there are more items to be loaded then add an extra placeholder row to trigger additional page loads.
  const itemCount = hasMore ? items.length + 1 : items.length

  return (
    <>
      <Snackbars />
      <Dialogs />

      <Box
        bg="darkerGray"
        fontFamily="default"
        fontSize={1}
        justifyContent="space-between"
        minHeight="100%"
      >
        {/* Header */}
        <Header items={items} onClose={onClose} />

        {/* Items */}
        <Box
          bottom={0}
          mx="auto"
          overflow="hidden"
          position="absolute"
          ref={viewRef}
          top={[
            hasPicked ? 'headerRowHeight4x' : 'headerRowHeight3x', //
            hasPicked ? 'headerRowHeight3x' : 'headerRowHeight2x'
          ]}
          width="100%"
        >
          {hasItems && (view === 'grid' || 'table') && (
            <AutoSizer>
              {({height, width}) => {
                return (
                  <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={itemCount}
                    loadMoreItems={handleLoadMoreItems}
                  >
                    {({onItemsRendered, ref}: InfiniteLoaderRenderProps) => {
                      // View: Table
                      if (view === 'table') {
                        return (
                          <TableView
                            height={height}
                            items={items}
                            itemCount={itemCount}
                            onItemsRendered={onItemsRendered}
                            ref={ref}
                            selectedAssets={selectedAssets}
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
                          <CardView
                            height={height}
                            items={items}
                            itemCount={itemCount}
                            onItemsRendered={newItemsRendered}
                            ref={ref}
                            selectedAssets={selectedAssets}
                            width={width}
                          />
                        )
                      }
                    }}
                  </InfiniteLoader>
                )
              }}
            </AutoSizer>
          )}

          {/* No results */}
          {!hasItems && hasFetchedOnce && !fetching && (
            <Box fontSize={1} p={3} textColor="lighterGray">
              No results for the current query
            </Box>
          )}
        </Box>

        {/* Footer */}
        {/* {hasPicked && <Footer />} */}
      </Box>
    </>
  )
}

export default Browser
