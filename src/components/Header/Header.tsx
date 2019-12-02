import React from 'react'
import {IoIosClose} from 'react-icons/io'
// import pluralize from 'pluralize'
import ButtonGroup from 'part:@sanity/components/buttons/button-group'
import DropDownButton from 'part:@sanity/components/buttons/dropdown'
import Button from 'part:@sanity/components/buttons/default'
// import FileInputButton from 'part:@sanity/components/fileinput/button'
// import FaUpload from 'react-icons/lib/fa/upload'

import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import {ORDERS, VIEWS} from '../../config'
import Box from '../../styled/Box'
import {BrowserQueryOptions, Filter, Item, BrowserView} from '../../types'
import Progress from '../Progress/Progress'

type Props = {
  browserQueryOptions: BrowserQueryOptions
  browserView: BrowserView
  filters: Filter[]
  items: Item[]
  onClose?: () => void
  onUpdateBrowserQueryOptions: (field: string, value: Record<string, any>) => void
  onUpdateBrowserView: (view: BrowserView) => void
}

const Header = (props: Props) => {
  const {
    browserQueryOptions,
    browserView,
    filters,
    onClose,
    onUpdateBrowserQueryOptions,
    onUpdateBrowserView
  } = props

  const {
    fetching
    // totalCount
  } = useAssetBrowserState()

  return (
    <Box
      bg="darkestGray"
      color="lightGray"
      height="headerHeight"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      overflow="hidden"
      position="absolute"
      top={0}
      whiteSpace="nowrap"
      width="100%"
      zIndex="header"
    >
      {/* Progress bar */}
      <Progress key={browserQueryOptions.pageIndex} loading={fetching} />

      {/* File upload */}
      {/*
      <Box alignItems="center" display="flex" p={2}>
        <Box fontSize={2}>
          <FileInputButton
            color="primary"
            disabled={true}
            icon={FaUpload}
            inverted
            onSelect={() => {}}
            style={{
              padding: '0 1.5em'
            }}
          >
            Upload
          </FileInputButton>
        </Box>
      </Box>
      */}

      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        height="100%"
        justifyContent="space-between"
        width="100%"
      >
        {/* LHS: View toggles */}
        <Box alignItems="center" display="flex" flex="1" height="100%">
          {onClose && (
            <Button bleed={true} kind="simple" onClick={onClose} ripple={false}>
              <IoIosClose size={30} />
            </Button>
          )}

          {/* Total image count / picked count */}
          {/*
          <Box pl={2}>
            {totalCount === -1 ? (
              'Loading..'
            ) : (
              <span>
                {totalCount > 0
                  ? `${totalCount} ${pluralize('image', totalCount)}`
                  : 'No images found'}
              </span>
            )}
          </Box>
          */}
        </Box>

        {/* Center */}
        <Box></Box>

        {/* RHS: Filters + order dropdowns */}
        <Box display="flex" height="100%" textAlign="right">
          <ButtonGroup>
            {VIEWS &&
              VIEWS.map((view, index) => {
                const selected = browserView.value === view.value
                return (
                  <Button
                    bleed={true}
                    bg="primary"
                    kind="simple"
                    key={index}
                    onClick={() => onUpdateBrowserView(view)}
                    ripple={false}
                    style={{
                      borderRadius: 0,
                      color: selected ? 'white' : 'currentColor',
                      opacity: selected ? 1 : 0.5
                    }}
                  >
                    {view.icon({size: 18})}
                  </Button>
                )
              })}
          </ButtonGroup>

          <DropDownButton
            items={filters}
            kind="simple"
            onAction={(value: Record<string, string>) => {
              onUpdateBrowserQueryOptions('filter', value)
            }}
            ripple={false}
          >
            {browserQueryOptions.filter.title}
          </DropDownButton>
          <DropDownButton
            bleed={true}
            items={ORDERS}
            kind="simple"
            onAction={(value: Record<string, string>) =>
              onUpdateBrowserQueryOptions('order', value)
            }
            ripple={false}
          >
            {browserQueryOptions.order.title}
          </DropDownButton>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
