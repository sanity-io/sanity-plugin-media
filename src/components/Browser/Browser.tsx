import produce from 'immer'
import React, {useRef, useState, useEffect} from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import {ORDERS, VIEWS, getFilters} from '../../config'
import Box from '../../styled/Box'
import {BrowserQueryOptions, Filter, Asset, BrowserView} from '../../types'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import CardView from '../View/Card'
import TableView from '../View/Table'
import ViewportObserver from '../ViewportObserver/ViewportObserver'

const PER_PAGE = 20

type Props = {
  document?: any
  onClose?: () => void
  selectedAssets?: Asset[]
}

const Browser = (props: Props) => {
  const {document: currentDocument, onClose, selectedAssets} = props

  const filters: Filter[] = getFilters(currentDocument)

  const viewRef = useRef<HTMLDivElement | null>(null)

  const {onFetch} = useAssetBrowserActions()
  const {
    fetchCount,
    fetching,
    items
    // totalCount
  } = useAssetBrowserState()
  const [browserQueryOptions, setBrowserQueryOptions] = useState<BrowserQueryOptions>({
    filter: filters[0],
    order: ORDERS[0],
    pageIndex: 0,
    replaceOnFetch: false
  })
  const [browserView, setBrowserView] = useState<BrowserView>(VIEWS[0])

  // const hasFetchedOnce = totalCount >= 0
  const hasFetchedOnce = fetchCount >= 0

  const fetchPage = (index: number, replace: boolean) => {
    const {filter, order} = browserQueryOptions

    const start = index * PER_PAGE
    const end = start + PER_PAGE

    const sort = `order(${order.value})`
    const selector = `[${start}...${end}]`

    // Can be null when operating on pristine / unsaved drafts
    const currentDocumentId = currentDocument && currentDocument._id

    onFetch({
      filter: filter.value,
      ...(currentDocumentId ? {params: {documentId: currentDocumentId}} : {}),
      projections: `{
        _id,
        _updatedAt,
        extension,
        metadata {
          dimensions,
          isOpaque,
        },
        originalFilename,
        size,
        url
      }`,
      replace,
      selector,
      sort
    })
  }

  const scrollToTop = () => {
    const viewEl = viewRef && viewRef.current
    if (viewEl) {
      viewEl.scrollTo(0, 0)
    }
  }

  // Fetch items on mount and when query options have changed
  useDeepCompareEffect(() => {
    const {pageIndex, replaceOnFetch} = browserQueryOptions

    fetchPage(pageIndex, replaceOnFetch)

    // Scroll to top when replacing items
    if (replaceOnFetch) {
      scrollToTop()
    }
  }, [browserQueryOptions])

  // Scroll to top when browser view has changed
  useEffect(() => {
    scrollToTop()
  }, [browserView])

  // NOTE: The below is a workaround and can be inaccurate in certain cases.
  // e.g. if PER_PAGE is 10 and you have fetched 10 items, `hasMore` will still be true
  // and another fetch will invoked on next page (which will return 0 items).
  // This is currently how the default asset source in Sanity works.
  // TODO: When it's performant enough to get total asset count across large datasets, revert
  // to using `totalCount` across the board.
  const hasMore = fetchCount === PER_PAGE
  // const hasMore = (browserQueryOptions.pageIndex + 1) * PER_PAGE < totalCount

  const handleFetchNextPage = () => {
    setBrowserQueryOptions(
      produce(draft => {
        draft.pageIndex += 1
        draft.replaceOnFetch = false
      })
    )
  }

  const handleUpdateBrowserQueryOptions = (field: string, value: Record<string, any>) => {
    setBrowserQueryOptions(
      produce(draft => {
        draft[field] = value
        draft.pageIndex = 0
        draft.replaceOnFetch = true
      })
    )
  }

  const handleUpdateBrowserView = (view: BrowserView) => {
    setBrowserView(view)
  }

  return (
    <Box bg="darkerGray" fontSize={1} justifyContent="space-between" minHeight="100%">
      {/* Header */}
      <Header
        browserQueryOptions={browserQueryOptions}
        browserView={browserView}
        filters={filters}
        items={items}
        onClose={onClose}
        onUpdateBrowserQueryOptions={handleUpdateBrowserQueryOptions}
        onUpdateBrowserView={handleUpdateBrowserView}
      />

      {/* Items */}
      <Box
        bottom={[0, 'headerHeight']}
        mb={['headerHeight', 0]}
        mx="auto"
        overflowX="hidden"
        overflowY="scroll"
        position="absolute"
        ref={viewRef}
        top="headerHeight"
        width="100%"
      >
        {/* View: Grid */}
        {browserView.value === 'grid' && (
          <Box m={2}>
            <CardView items={items} selectedAssets={selectedAssets} />
          </Box>
        )}

        {/* View: Table */}
        {browserView.value === 'table' && (
          <TableView items={items} selectedAssets={selectedAssets} />
        )}

        {/* Viewport observer */}
        {hasFetchedOnce && !fetching && (
          <ViewportObserver
            onVisible={() => {
              if (hasMore) {
                handleFetchNextPage()
              }
            }}
          />
        )}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  )
}

export default Browser
