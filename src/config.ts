import {AiFillAppstore, AiOutlineBars} from 'react-icons/ai'
import {Document} from './types'

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
    /*
    // This query is horribly inefficient and slow as molasses on large datasets.
    // TODO: Re-enable with a more performant GROQ query
    items.splice(1, 0, {
      title: 'Images in current entry',
      value: `_type == "sanity.imageAsset" && $documentId in *[references(^._id)]._id`
    })
    */
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
