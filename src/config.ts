import {BrowserSelect} from '@types'

// Sort order dropdown options
// null values are represented as menu dividers
export const BROWSER_SELECT: (BrowserSelect | null)[] = [
  {
    order: {
      direction: 'desc',
      field: '_createdAt'
    },
    title: 'Last created: Newest first'
  },
  {
    order: {
      direction: 'asc',
      field: '_createdAt'
    },
    title: 'Last created: Oldest first'
  },
  // Divider
  null,
  {
    order: {
      direction: 'desc',
      field: '_updatedAt'
    },
    title: 'Last updated: Newest first'
  },
  {
    order: {
      direction: 'asc',
      field: '_updatedAt'
    },
    title: 'Last updated: Oldest first'
  },
  // Divider
  null,
  {
    order: {
      direction: 'asc',
      field: 'originalFilename'
    },
    title: 'File name: A to Z'
  },
  {
    order: {
      direction: 'desc',
      field: 'originalFilename'
    },
    title: 'File name: Z to A'
  },
  // Divider
  null,
  {
    order: {
      direction: 'desc',
      field: 'size'
    },
    title: 'File size: Largest first'
  },
  {
    order: {
      direction: 'asc',
      field: 'size'
    },
    title: 'File size: Smallest first'
  }
]

// Expose development debug bar
export const DEBUG_MODE = true
