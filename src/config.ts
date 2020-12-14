import {Document, BrowserFilter, BrowserSelect} from '@types'

// Filters to display in header dropdown
export const getFilters = (currentDocument?: Document) => {
  const items: BrowserFilter[] = [
    {
      title: 'All images',
      value: `_type == "sanity.imageAsset"`
    },
    {
      title: 'Unused images',
      value: `_type == "sanity.imageAsset" && count(*[references(^._id)]) == 0`
    }
  ]

  if (currentDocument && currentDocument._id) {
    // This query is very slow (!) on larger datasets
    items.splice(1, 0, {
      title: 'Current entry (slow)',
      value: `_type == "sanity.imageAsset" && defined(*[_id == $documentId && references(^._id)][0])`
    })
  }

  return items
}

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
