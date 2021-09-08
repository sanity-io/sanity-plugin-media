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

export const API_VERSION = '2021-06-07'
export const PANEL_HEIGHT = 32 // px
export const TAG_DOCUMENT_NAME = 'media.tag'
export const TAGS_PANEL_WIDTH = 250 // px
// NOTE: Manually set plugin z-index values to be higher than Sanity's header search field
// (which is currently 500202). Also ensure toasts always sit above dialogs.
export const Z_INDEX_APP = 600000
export const Z_INDEX_DIALOG = 600001
export const Z_INDEX_TOAST_PROVIDER = 600002
