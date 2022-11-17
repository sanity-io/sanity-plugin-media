import {SearchFacetInputProps, SearchFacetDivider, SearchFacetGroup, OrderDirection} from '@types'
import {divider, inputs} from './config/searchFacets'

// Sort order dropdown options
// null values are represented as menu dividers
export const ORDER_OPTIONS: ({direction: OrderDirection; field: string} | null)[] = [
  {
    direction: 'desc',
    field: '_createdAt'
  },
  {
    direction: 'asc',
    field: '_createdAt'
  },
  // Divider
  null,
  {
    direction: 'desc',
    field: '_updatedAt'
  },
  {
    direction: 'asc' as OrderDirection,
    field: '_updatedAt'
  },
  // Divider
  null,
  {
    direction: 'asc',
    field: 'originalFilename'
  },
  {
    direction: 'desc',
    field: 'originalFilename'
  },
  // Divider
  null,
  {
    direction: 'desc',
    field: 'size'
  },
  {
    direction: 'asc',
    field: 'size'
  }
]

export const FACETS: (SearchFacetDivider | SearchFacetGroup | SearchFacetInputProps)[] = [
  inputs.tag,
  divider,
  inputs.inUse,
  inputs.inCurrentDocument,
  divider,
  inputs.title,
  inputs.altText,
  inputs.description,
  divider,
  inputs.isOpaque,
  divider,
  inputs.fileName,
  inputs.size,
  inputs.type,
  divider,
  inputs.orientation,
  inputs.width,
  inputs.height
]

export const GRID_TEMPLATE_COLUMNS = {
  SMALL: '3rem 100px auto 1.5rem',
  LARGE: '3rem 100px auto 5.5rem 5.5rem 3.5rem 8.5rem 2rem'
}
export const PANEL_HEIGHT = 32 // px
export const TAG_DOCUMENT_NAME = 'media.tag'
export const TAGS_PANEL_WIDTH = 250 // px
