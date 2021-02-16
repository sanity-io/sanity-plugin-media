import {black, hues} from '@sanity/color'
import {Checkbox, Flex} from '@sanity/ui'
import React, {FC, MouseEvent} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {Box as LegacyBox} from 'theme-ui'
import {PANEL_HEIGHT} from '../../constants'

import useTypedSelector from '../../hooks/useTypedSelector'
import {assetsActions, selectAssetsLength, selectAssetsPickedLength} from '../../modules/assets'
import TableHeaderItem from '../TableHeaderItem'

// TODO: DRY
const ContextActionContainer = styled(Flex)`
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${hues.gray?.[900].hex};
    }
  }
`

const TableHeader: FC = () => {
  // Redux
  const dispatch = useDispatch()

  const fetching = useTypedSelector(state => state.assets.fetching)
  const currentDocument = useTypedSelector(state => state.document)
  const itemsLength = useTypedSelector(selectAssetsLength)
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength)

  const allSelected = numPickedAssets === itemsLength

  // Callbacks
  const handleContextActionClick = (e: MouseEvent) => {
    e.stopPropagation()

    if (allSelected) {
      dispatch(assetsActions.pickClear())
    } else {
      dispatch(assetsActions.pickAll())
    }
  }

  return (
    <LegacyBox
      sx={{
        alignItems: 'center',
        bg: black.hex,
        borderBottom: `1px solid ${hues.gray?.[900].hex}`,
        display: ['none', null, null, 'grid'],
        gridColumnGap: [0, null, null, 3],
        gridTemplateColumns: 'tableLarge',
        height: `${PANEL_HEIGHT}px`,
        letterSpacing: '0.025em',
        position: 'sticky',
        textTransform: 'uppercase',
        top: 0,
        width: '100%',
        zIndex: 1 // force stacking context
      }}
    >
      <ContextActionContainer
        align="center"
        justify="center"
        onClick={handleContextActionClick}
        style={{
          height: '100%',
          position: 'relative'
        }}
      >
        {!currentDocument && (
          <Checkbox
            checked={!fetching && allSelected}
            readOnly
            style={{
              pointerEvents: 'none', // TODO: consider alternative for usability
              transform: 'scale(0.8)'
            }}
          />
        )}
      </ContextActionContainer>

      <TableHeaderItem />
      <TableHeaderItem field="originalFilename" title="Filename" />
      <TableHeaderItem title="Resolution" />
      <TableHeaderItem field="mimeType" title="MIME type" />
      <TableHeaderItem field="size" title="Size" />
      <TableHeaderItem field="_updatedAt" title="Last updated" />
      <TableHeaderItem />
    </LegacyBox>
  )
}

export default TableHeader
