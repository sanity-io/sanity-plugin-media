const HEADER_ROW_HEIGHT = 50 // px

const headerRowHeight = (rows = 1) => `${HEADER_ROW_HEIGHT * rows}px`
const tableHeaderHeight = '34px'
const tableRowHeight = ['115px', '100px']

const sizes: string[] & Record<string, any> = []
sizes.headerRowHeight1x = headerRowHeight(1)
sizes.headerRowHeight2x = headerRowHeight(2)
sizes.headerRowHeight3x = headerRowHeight(3)
sizes.headerRowHeight4x = headerRowHeight(4)
sizes.tableHeaderHeight = tableHeaderHeight
sizes.tableRowHeight = tableRowHeight

const space: string[] & Record<string, any> = [
  '0.0rem',
  '0.3rem',
  '0.6rem',
  '1.2rem',
  '2.4rem',
  '4.8rem'
]
space.headerRowHeight1x = headerRowHeight(1)
space.headerRowHeight2x = headerRowHeight(2)
space.headerRowHeight3x = headerRowHeight(3)
space.headerRowHeight4x = headerRowHeight(4)
space.tableHeaderHeight = tableHeaderHeight
space.tableRowHeight = tableRowHeight

const theme = {
  breakpoints: ['55em'] as string[],
  gridTemplateColumns: {
    tableSmall: '3rem 8rem auto 1.5rem',
    tableLarge: '3rem 6rem auto 5.5rem 2.75rem 3.5rem 8.5rem 2rem'
  },
  sizes,
  space,
  tableRowHeight
}

export default theme
