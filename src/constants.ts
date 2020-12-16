import {
  ComparisonOperator,
  ComparisonOperatorMapping,
  LogicalOperator,
  LogicalOperatorMapping,
  SearchFacetProps
} from '@types'
import groq from 'groq'

export const COMPARISON_OPERATOR_MAPPING: ComparisonOperatorMapping = {
  eq: {
    label: 'is equal to',
    value: '=='
  },
  gt: {
    label: 'is greater than',
    value: '>'
  },
  gte: {
    label: 'is greater than or equal to',
    value: '>='
  },
  lt: {
    label: 'is less than',
    value: '<'
  },
  lte: {
    label: 'is less than or equal to',
    value: '<='
  }
}

// null values are represented as menu dividers
export const COMPARISON_OPERATOR_MENU_ITEMS_DEFAULT: (ComparisonOperator | null)[] = [
  'gt',
  'gte',
  'lt',
  'lte',
  null,
  'eq'
]

export const FACETS: SearchFacetProps[] = [
  // Size (with modifiers)
  {
    name: 'size',
    type: 'number',
    title: 'File size',
    field: 'size',
    modifier: 'kb',
    operators: {
      comparison: 'gt'
    },
    options: {
      modifiers: [
        {
          name: 'kb',
          title: 'KB',
          fn: val => val * 1000
        },
        {
          name: 'mb',
          title: 'MB',
          fn: val => val * 1000000
        }
      ]
    },
    value: 0
  },
  // In use
  {
    name: 'inUse',
    type: 'select',
    title: 'In use',
    operators: {
      logical: 'is'
    },
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
      ],
      logical: false
    },
    value: 'true'
  },
  // Orientation
  {
    name: 'orientation',
    type: 'select',
    title: 'Orientation',
    operators: {
      logical: 'is'
    },
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
      ]
    },
    value: 'portrait'
  }
]

export const LOGICAL_OPERATOR_MAPPING: LogicalOperatorMapping = {
  is: 'is',
  not: 'is not'
}

export const LOGICAL_OPERATOR_MENU_ITEMS_DEFAULT: (LogicalOperator | null)[] = ['is', 'not']
