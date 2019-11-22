import produce from 'immer'
import React, {useRef, useState} from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import {useAssetBrowserActions} from '../../contexts/AssetBrowserDispatchContext'
import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import {ORDERS, VIEWS, getFilters} from '../../config'
import Box from '../../styled/Box'
import {BrowserOptions, Filter, Asset} from '../../types'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import CardView from '../View/Card'
import TableView from '../View/Table'
import ViewportObserver from '../ViewportObserver/ViewportObserver'

const PER_PAGE = 20

type Props = {
  // TODO: use correct type
  document?: any
  onClose?: () => void
  selectedAssets?: Asset[]
}

const Browser = (props: Props) => {
  const {document: currentDocument, onClose, selectedAssets} = props

  const filters: Filter[] = getFilters(currentDocument)

  const viewRef = useRef<HTMLDivElement | null>(null)

  const {onFetch} = useAssetBrowserActions()
  const {fetching, items, totalCount} = useAssetBrowserState()
  const [browserOptions, setBrowserOptions] = useState<BrowserOptions>({
    filter: filters[0],
    order: ORDERS[0],
    pageIndex: 0,
    replaceOnFetch: false,
    view: VIEWS[0]
  })

  const hasFetchedOnce = totalCount >= 0

  const fetchPage = (index: number, replace: boolean) => {
    const {filter, order} = browserOptions

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

  // Fetch items on mount and when options have changed
  useDeepCompareEffect(() => {
    const {pageIndex, replaceOnFetch} = browserOptions

    fetchPage(pageIndex, replaceOnFetch)

    // Scroll to top when replacing items
    if (replaceOnFetch) {
      scrollToTop()
    }
  }, [browserOptions])

  const hasMore = (browserOptions.pageIndex + 1) * PER_PAGE < totalCount

  const handleFetchNextPage = () => {
    setBrowserOptions(
      produce(draft => {
        draft.pageIndex += 1
        draft.replaceOnFetch = false
      })
    )
  }

  const handleUpdateBrowserOptions = (field: string, value: Record<string, any>) => {
    setBrowserOptions(
      produce(draft => {
        draft[field] = value
        draft.pageIndex = 0
        draft.replaceOnFetch = true
      })
    )
  }

  return (
    <Box bg="darkerGray" fontSize={1} justifyContent="space-between" minHeight="100%">
      {/* Header */}
      <Header
        browserOptions={browserOptions}
        filters={filters}
        items={items}
        onClose={onClose}
        onUpdateBrowserOptions={handleUpdateBrowserOptions}
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
        {browserOptions.view?.value === 'grid' && (
          <Box m={2}>
            <CardView items={items} selectedAssets={selectedAssets} />
          </Box>
        )}

        {/* View: Table */}
        {browserOptions.view?.value === 'table' && (
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
