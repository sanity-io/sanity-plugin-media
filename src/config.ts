import {BrowserSelect} from '@types'

// Sort order dropdown options
export const BROWSER_SELECT: BrowserSelect[] = [
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
  {
    order: {
      direction: 'asc',
      field: 'originalFilename'
    },
    title: 'Filename: A to Z'
  },
  {
    order: {
      direction: 'desc',
      field: 'originalFilename'
    },
    title: 'Filename: Z to A'
  },
  {
    order: {
      direction: 'desc',
      field: 'size'
    },
    title: 'Filesize: Largest first'
  },
  {
    order: {
      direction: 'asc',
      field: 'size'
    },
    title: 'Filesize: Smallest first'
  },
  {
    order: {
      direction: 'asc',
      field: 'mimeType'
    },
    title: 'MIME type: A to Z'
  },
  {
    order: {
      direction: 'desc',
      field: 'mimeType'
    },
    title: 'MIME type: Z to A'
  }
]
