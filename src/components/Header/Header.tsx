import React from 'react'
import {AiFillAppstore, AiOutlineBars} from 'react-icons/ai'
import {IoIosClose} from 'react-icons/io'
import {useDispatch} from 'react-redux'

import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import {ORDERS} from '../../config'
import useTypedSelector from '../../hooks/useTypedSelector'
import {
  browserSetFilter,
  browserSetOrder,
  browserSetSearchQuery,
  browserSetView
} from '../../modules/browser'
import Box from '../../styled/Box'
import blocksToText from '../../util/blocksToText'
import {Document, Item} from '../../types'
import Button from '../Button/Button'
import Label from '../Label/Label'
import Progress from '../Progress/Progress'
import SearchInput from '../SearchInput/SearchInput'
import Select from '../Select/Select'

type Props = {
  currentDocument?: Document
  items: Item[]
  onClose?: () => void
}

const Header = (props: Props) => {
  const {currentDocument, onClose} = props

  // Redux
  const dispatch = useDispatch()
  const searchQuery = useTypedSelector(state => state.browser.searchQuery)
  const view = useTypedSelector(state => state.browser.view)
  const filters = useTypedSelector(state => state.browser.filters)
  const pageIndex = useTypedSelector(state => state.browser.pageIndex)

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
          height="headerRowHeight"
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
            <Box
              // bg="darkerGray"
              flexShrink={0}
              height="100%"
            >
              <Button icon={IoIosClose({size: 25})} onClick={onClose} />
            </Box>
          )}
        </Box>
      )}

      {/* Rows */}
      <Box
        alignItems={['flex-start', 'center']}
        display="flex"
        flexDirection={['column', 'row']}
        height={['headerRowHeight2x', 'headerRowHeight']}
        justifyContent="space-between"
        textAlign="right"
        width="100%"
      >
        {/* Search */}
        <Box
          alignItems="center"
          display="flex"
          flexGrow={1}
          height="100%"
          justifyContent="flex-start"
          width="100%"
        >
          <SearchInput
            maxWidth={['none', '340px']}
            mx={2}
            onChange={e => dispatch(browserSetSearchQuery(e.currentTarget.value))}
            value={searchQuery}
          />
        </Box>

        {/* Views + filters + orders*/}
        <Box
          alignItems="center"
          display="flex"
          height="100%"
          justifyContent={['space-between', 'flex-end']}
          width="100%"
        >
          <Box display="flex">
            <Button
              icon={AiFillAppstore({size: 18})}
              onClick={() => dispatch(browserSetView('grid'))}
              pointerEvents={view === 'grid' ? 'none' : 'auto'}
              variant={view === 'grid' ? 'default' : 'secondary'}
            />

            <Button
              icon={AiOutlineBars({size: 18})}
              onClick={() => dispatch(browserSetView('table'))}
              pointerEvents={view === 'table' ? 'none' : 'auto'}
              variant={view === 'table' ? 'default' : 'secondary'}
            />
          </Box>

          <Box>
            {filters && (
              <Select
                items={filters}
                ml={2}
                onChange={value => dispatch(browserSetFilter(value))}
              />
            )}
            <Select items={ORDERS} mx={2} onChange={value => dispatch(browserSetOrder(value))} />
          </Box>
        </Box>
      </Box>

      {/* Progress bar */}
      <Progress key={pageIndex} loading={fetching} />
    </Box>
  )
}

export default Header
