import MdFormatListBulleted from 'react-icons/lib/md/format-list-bulleted'
import MdDashboard from 'react-icons/lib/md/dashboard'

export const getFilters = (currentDocument: any) => {
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
    items.splice(1, 0, {
      title: 'Images in current entry',
      value: `_type == "sanity.imageAsset" && $documentId in *[references(^._id)]._id`
    })
  }

  return items
}

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

export const VIEWS = [
  {
    icon: MdDashboard,
    title: 'Grid',
    value: 'grid'
  },
  {
    icon: MdFormatListBulleted,
    title: 'Table',
    value: 'table'
  }
]
