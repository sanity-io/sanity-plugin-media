import React, {FC} from 'react'
import {Box as LegacyBox} from 'theme-ui'

import TableHeaderItem from '../TableHeaderItem'

const TableHeader: FC = () => {
  return (
    <LegacyBox
      sx={{
        alignItems: 'center',
        bg: 'black', // TODO: use theme color
        display: ['none', null, null, 'grid'],
        gridColumnGap: [2, null, null, 3],
        gridTemplateColumns: 'tableLarge',
        height: '2em',
        letterSpacing: '0.025em',
        position: 'sticky',
        textTransform: 'uppercase',
        top: 0,
        width: '100%',
        zIndex: 1 // TODO: try to avoid manually setting z-indices
      }}
    >
      <TableHeaderItem />
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
