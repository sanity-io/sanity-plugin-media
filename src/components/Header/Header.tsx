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
import {BrowserQueryOptions, BrowserView, Document, Filter, Item} from '../../types'
import Progress from '../Progress/Progress'

type Props = {
  browserQueryOptions: BrowserQueryOptions
  browserView: BrowserView
  currentDocument?: Document
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

  return (
    <Box
      alignItems="center"
      bg="darkestGray"
      color="lighterGray"
      display="flex"
      flexDirection={['column', 'row']}
      flexWrap="wrap"
      height={[currentDocument ? 'headerHeight.0' : 'headerHeight.1', 'headerHeight.1']}
      justifyContent="space-between"
      overflow="hidden"
      position="absolute"
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
          <Box
            bg="darkGray"
            borderRadius="2px"
            color="lighterGray"
            fontSize={1}
            fontWeight={500}
            maxWidth="500px"
            mx={2}
            overflow="hidden"
            px={2}
            py={1}
            textOverflow="ellipsis"
          >
            <Box
              color="lightGray"
              fontSize={0}
              display="inline"
              mr={2}
              py={1}
              textTransform="uppercase"
            >
              {currentDocument._type}
            </Box>
            {currentDocument.title || <em>Untitled</em>}
          </Box>

          {onClose && (
            <Box display={['block', 'none']} height="100%">
              <Button bleed={true} onClick={onClose} ripple={false}>
                <IoIosClose size={25} />
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Box
        display="flex"
        height="headerHeight.1"
        justifyContent={['space-between', 'flex-end']}
        textAlign="right"
        width={['100%', 'auto']}
      >
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

        <ButtonGroup>
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
        </ButtonGroup>

        {onClose && (
          <Box display={[currentDocument ? 'none' : 'block', 'block']} height="100%">
            <Button bleed={true} onClick={onClose} ripple={false}>
              <IoIosClose size={25} />
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Header
