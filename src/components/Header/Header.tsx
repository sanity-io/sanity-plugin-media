import Search from 'part:@sanity/components/textfields/search'
import React, {ChangeEvent, SyntheticEvent} from 'react'
import {IoIosClose} from 'react-icons/io'

import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import {ORDERS, VIEWS} from '../../config'
import Box from '../../styled/Box'
import blocksToText from '../../util/blocksToText'
import {BrowserQueryOptions, BrowserView, Document, Filter, Item} from '../../types'
import Button from '../Button/Button'
import Label from '../Label/Label'
import Progress from '../Progress/Progress'
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
      display="flex"
      flexDirection={['column', 'row']}
      flexWrap="wrap"
      height={[currentDocument ? 'headerHeight.0' : 'headerHeight.1', 'headerHeight.1']}
      justifyContent="space-between"
      overflow="hidden"
      position="absolute"
      textColor="lighterGray"
      top={0}
      whiteSpace="nowrap"
      width="100%"
    >
      {/* Progress bar */}
      <Progress key={browserQueryOptions.pageIndex} loading={fetching} />

      {currentDocument && (
        <Box
          alignItems="center"
          display="flex"
          flex="3 0"
          height="headerHeight.1"
          justifyContent="space-between"
          overflow="hidden"
          textAlign="left"
          width={['100%', 'auto']}
        >
          {/* Label */}
          <Label
            title={currentDocumentTitle ? currentDocumentTitle : currentDocument._id}
            type={`${currentDocument._type} ${!currentDocumentTitle ? 'id' : ''}`}
          />

          {/* Close (small breakpoint) */}
          {onClose && (
            <Box bg="darkerGray" display={['block', 'none']} height="100%">
              <Button icon={IoIosClose({size: 25})} onClick={onClose} />
            </Box>
          )}
        </Box>
      )}

      <Box
        alignItems="center"
        display="flex"
        height="headerHeight.1"
        justifyContent={['space-between', 'flex-end']}
        textAlign="right"
        width={['100%', 'auto']}
      >
        <Box display="flex" height="100%">
          <Search
            label=""
            onChange={(event: SyntheticEvent<HTMLInputElement, ChangeEvent>) => {
              onUpdateBrowserQueryOptions('q', event.currentTarget.value)
            }}
            placeholder="Search media"
            value={browserQueryOptions.q}
          />
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

        <Box display="flex" height="100%">
          <Select
            items={filters}
            onChange={value => onUpdateBrowserQueryOptions('filter', value)}
          />

          <Select items={ORDERS} onChange={value => onUpdateBrowserQueryOptions('order', value)} />
        </Box>

        {/* Close (large breakpoint) */}
        {onClose && (
          <Box bg="darkerGray" display={[currentDocument ? 'none' : 'flex', 'flex']} height="100%">
            <Button icon={IoIosClose({size: 25})} onClick={onClose} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Header
