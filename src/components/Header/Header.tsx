import React from 'react'
import IoIosCloseEmpty from 'react-icons/lib/io/ios-close-empty'
// import pluralize from 'pluralize'
import ButtonGroup from 'part:@sanity/components/buttons/button-group'
import DropDownButton from 'part:@sanity/components/buttons/dropdown'
import Button from 'part:@sanity/components/buttons/default'
// import FileInputButton from 'part:@sanity/components/fileinput/button'
// import FaUpload from 'react-icons/lib/fa/upload'

// import {useAssetBrowserState} from '../../contexts/AssetBrowserStateContext'
import {ORDERS, VIEWS} from '../../config'
import Box from '../../styled/Box'
import {BrowserOptions, Filter, Item} from '../../types'

type Props = {
  //
  browserOptions: BrowserOptions
  filters: Filter[]
  items: Item[]
  onClose?: () => void
  onUpdateBrowserOptions: (field: string, value: Record<string, any>) => void
}

const Header = (props: Props) => {
  const {browserOptions, filters, onClose, onUpdateBrowserOptions} = props
  // const {totalCount} = useAssetBrowserState()

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
              <IoIosCloseEmpty size={30} />
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
                const selected = browserOptions.view.value === view.value
                return (
                  <Button
                    bleed={true}
                    bg="primary"
                    kind="simple"
                    key={index}
                    onClick={() => onUpdateBrowserOptions('view', view)}
                    ripple={false}
                    style={{
                      borderRadius: 0,
                      color: selected ? 'white' : 'currentColor',
                      opacity: selected ? 1 : 0.5
                    }}
                  >
                    {new view.icon({size: 18})}
                  </Button>
                )
              })}
          </ButtonGroup>

          <DropDownButton
            items={filters}
            kind="simple"
            onAction={(value: Record<string, string>) => {
              onUpdateBrowserOptions('filter', value)
            }}
            ripple={false}
          >
            {browserOptions.filter.title}
          </DropDownButton>
          <DropDownButton
            bleed={true}
            items={ORDERS}
            kind="simple"
            onAction={(value: Record<string, string>) => onUpdateBrowserOptions('order', value)}
            ripple={false}
          >
            {browserOptions.order.title}
          </DropDownButton>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
