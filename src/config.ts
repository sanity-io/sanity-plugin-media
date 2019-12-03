import {AiFillAppstore, AiOutlineBars} from 'react-icons/ai'
import {Document} from './types'

// Filters to display in header dropdown
export const getFilters = (currentDocument?: Document) => {
  const items = [
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
export const ORDERS = [
  {
    title: 'Latest first',
    value: '_updatedAt desc'
  },
  {
    title: 'Oldest first',
    value: '_updatedAt asc'
  },
  {
    title: 'Filename: A ⟶ Z',
    value: 'originalFilename asc'
  },
  {
    title: 'Filename: Z ⟶ A',
    value: 'originalFilename desc'
  }
]

// View buttons
export const VIEWS = [
  {
    icon: AiFillAppstore,
    title: 'Grid',
    value: 'grid'
  },
  {
    icon: AiOutlineBars,
    title: 'Table',
    value: 'table'
  }
]
