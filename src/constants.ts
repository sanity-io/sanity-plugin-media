import {BrowserSelect, SearchFacetOperators, SearchFacetInputProps} from '@types'
import groq from 'groq'

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

export const SEARCH_FACET_OPERATORS: SearchFacetOperators = {
  doesNotInclude: {
    fn: (value, field) => (value ? `!(${field} match '*${value}*')` : undefined),
    label: 'does not include'
  },
  doesNotReference: {
    fn: (value, _) => (value ? `!references('${value}')` : undefined),
    label: 'does not includes'
  },
  empty: {
    fn: (_, field) => `!defined(${field})`,
    hideInput: true,
    label: 'is empty'
  },
  equalTo: {
    fn: (value, field) => (value ? `${field} == ${value}` : undefined),
    label: 'is equal to'
  },
  greaterThan: {
    fn: (value, field) => (value ? `${field} > ${value}` : undefined),
    label: 'is greater than'
  },
  greaterThanOrEqualTo: {
    fn: (value, field) => (value ? `${field} >= ${value}` : undefined),
    label: 'is greater than or equal to'
  },
  includes: {
    fn: (value, field) => (value ? `${field} match '*${value}*'` : undefined),
    label: 'includes'
  },
  is: {
    fn: value => `${value}`,
    label: 'is'
  },
  isNot: {
    fn: value => `!(${value})`,
    label: 'is not'
  },
  lessThan: {
    fn: (value, field) => (value ? `${field} < ${value}` : undefined),
    label: 'is less than'
  },
  lessThanOrEqualTo: {
    fn: (value, field) => (value ? `${field} <= ${value}` : undefined),
    label: 'is less than or equal to'
  },
  notEmpty: {
    fn: (_, field) => `defined(${field})`,
    hideInput: true,
    label: 'is not empty'
  },
  references: {
    fn: (value, _) => (value ? `references('${value}')` : undefined),
    label: 'includes'
  }
}

// null values are represented as menu dividers
export const FACETS: (SearchFacetInputProps | null)[] = [
  // Tag
  {
    field: 'tags',
    name: 'tag',
    title: 'Tags',
    type: 'searchable',
    operatorType: 'references',
    options: {
      operatorTypes: ['references', 'doesNotReference', null, 'empty', 'notEmpty']
    }
  },
  // In use
  {
    name: 'inUse',
    type: 'select',
    title: 'In use',
    operatorType: 'is',
    options: {
      list: [
        {
          name: 'true',
          title: 'True',
          value: groq`count(*[references(^._id)]) > 0`
        },
        {
          name: 'false',
          title: 'False',
          value: groq`count(*[references(^._id)]) == 0`
        }
      ]
    },
    value: 'true'
  },
  // TODO: tags
  // Divider
  null,
  // Title
  {
    name: 'title',
    type: 'string',
    title: 'Title',
    field: 'title',
    operatorType: 'empty',
    options: {
      operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude']
    },
    value: ''
  },
  // Alt text
  {
    name: 'altText',
    type: 'string',
    title: 'Alt Text',
    field: 'altText',
    operatorType: 'empty',
    options: {
      operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude']
    },
    value: ''
  },
  // Description
  {
    name: 'description',
    type: 'string',
    title: 'Description',
    field: 'description',
    operatorType: 'empty',
    options: {
      operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude']
    },
    value: ''
  },
  // Divider
  null,
  // Size
  {
    name: 'size',
    type: 'number',
    title: 'File size',
    field: 'size',
    modifier: 'kb',
    operatorType: 'greaterThan',
    options: {
      modifiers: [
        {
          name: 'kb',
          title: 'KB',
          fieldModifier: fieldName => `round(${fieldName} / 1000)`
        },
        {
          name: 'mb',
          title: 'MB',
          fieldModifier: fieldName => `round(${fieldName} / 1000000)`
        }
      ],
      operatorTypes: [
        'greaterThan',
        'greaterThanOrEqualTo',
        'lessThan',
        'lessThanOrEqualTo',
        null,
        'equalTo'
      ]
    },
    value: 0
  },
  // Divider
  null,
  // Orientation
  {
    name: 'orientation',
    type: 'select',
    title: 'Orientation',
    operatorType: 'is',
    options: {
      list: [
        {
          name: 'portrait',
          title: 'Portrait',
          value: 'metadata.dimensions.aspectRatio < 1'
        },
        {
          name: 'landscape',
          title: 'Landscape',
          value: 'metadata.dimensions.aspectRatio > 1'
        },
        {
          name: 'square',
          title: 'Square',
          value: 'metadata.dimensions.aspectRatio == 1'
        }
      ],
      operatorTypes: ['is', 'isNot']
    },
    value: 'portrait'
  },
  // Width (with modifiers)
  {
    name: 'width',
    type: 'number',
    title: 'Width',
    field: 'metadata.dimensions.width',
    options: {
      operatorTypes: [
        'greaterThan',
        'greaterThanOrEqualTo',
        'lessThan',
        'lessThanOrEqualTo',
        null,
        'equalTo'
      ]
    },
    operatorType: 'greaterThan',
    value: 400
  },
  // Height (with modifiers)
  {
    name: 'height',
    type: 'number',
    title: 'Height',
    field: 'metadata.dimensions.height',
    options: {
      operatorTypes: [
        'greaterThan',
        'greaterThanOrEqualTo',
        'lessThan',
        'lessThanOrEqualTo',
        null,
        'equalTo'
      ]
    },
    operatorType: 'greaterThan',
    value: 400
  }
]
