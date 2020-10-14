import React from 'react'
import {IoIosClose} from 'react-icons/io'

import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import {ORDERS, VIEWS} from '../../config'
import Box from '../../styled/Box'
import blocksToText from '../../util/blocksToText'
import {BrowserQueryOptions, BrowserView, Document, Filter, Item} from '../../types'
import Button from '../Button/Button'
import Label from '../Label/Label'
import Progress from '../Progress/Progress'
import SearchInput from '../SearchInput/SearchInput'
import Select from '../Select/Select'

type Props = {
  browserQueryOptions: BrowserQueryOptions
  browserView: BrowserView
  currentDocument?: Document
  filters: Filter[]
  items: Item[]
  onClose?: () => void
  onUpdateBrowserQueryOptions: (field: string, value: Filter | string) => void
  onUpdateBrowserView: (view: BrowserView) => void
}

const Header = (props: Props) => {
  const {
    browserQueryOptions,
    browserView,
    currentDocument,
    filters,
    onClose,
    onUpdateBrowserQueryOptions,
    onUpdateBrowserView
  } = props

  const {
    fetching
    // totalCount
  } = useAssetBrowserState()

  // Try and infer title from `name` and `title` fields, in that order.
  // Convert blocks to plain text and trim extra whitespace.
  // If no title is found, the current document ID will be displayed instead.
  const currentDocumentTitle = blocksToText(currentDocument?.name || currentDocument?.title)?.trim()

  return (
    <Box
      alignItems="center"
      bg="darkestGray"
      height={currentDocument ? 'headerHeight.0' : 'headerHeight.1'}
      justifyContent="space-between"
      overflow="hidden"
      position="absolute"
      textColor="lighterGray"
      top={0}
      whiteSpace="nowrap"
      width="100%"
    >
      {/* Row: Current document / close button */}
      {currentDocument && (
        <Box
          alignItems="center"
          display="flex"
          height="headerHeight.1"
          justifyContent="space-between"
          overflow="hidden"
          textAlign="left"
          width="100%"
        >
          {/* Label */}
          <Label
            minWidth={0}
            title={currentDocumentTitle ? currentDocumentTitle : currentDocument._id}
            type={`${currentDocument._type} ${!currentDocumentTitle ? 'id' : ''}`}
          />

          {/* Close */}
          {onClose && (
            <Box bg="darkerGray" flexShrink={0} height="100%">
              <Button icon={IoIosClose({size: 25})} onClick={onClose} />
            </Box>
          )}
        </Box>
      )}

      {/* Row: Filters / Search / Views */}
      <Box
        alignItems="center"
        display="flex"
        height="headerHeight.1"
        justifyContent="space-between"
        textAlign="right"
        width={['100%', 'auto']}
      >
        <Box alignItems="center" display="flex" height="100%">
          {/* Views */}
          {VIEWS &&
            VIEWS.map((view, index) => {
              const selected = browserView.value === view.value

              return (
                <Button
                  icon={view.icon({size: 18})}
                  key={index}
                  onClick={() => onUpdateBrowserView(view)}
                  pointerEvents={selected ? 'none' : 'auto'}
                  variant={selected ? 'default' : 'secondary'}
                />
              )
            })}
        </Box>

        <Box
          alignItems="center"
          display="flex"
          flexGrow={1}
          height="100%"
          justifyContent="flex-end"
        >
          {/* Search */}
          <SearchInput
            mx={2}
            onChange={e => onUpdateBrowserQueryOptions('q', e.currentTarget.value)}
            placeholder="Search"
            value={browserQueryOptions.q}
          />

          <Select
            items={filters}
            mr={2}
            onChange={value => onUpdateBrowserQueryOptions('filter', value)}
          />

          <Select
            items={ORDERS}
            mr={2}
            onChange={value => onUpdateBrowserQueryOptions('order', value)}
          />
        </Box>
      </Box>

      {/* Progress bar */}
      <Progress key={browserQueryOptions.pageIndex} loading={fetching} />
    </Box>
  )
}

export default Header
