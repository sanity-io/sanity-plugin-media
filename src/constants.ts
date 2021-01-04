import {SearchFacetOperators, SearchFacetInputProps} from '@types'
import groq from 'groq'

export const SEARCH_FACET_OPERATORS: SearchFacetOperators = {
  equalTo: {
    fn: (value, field) => `${field} == ${value}`,
    label: 'is equal to'
  },
  greaterThan: {
    fn: (value, field) => `${field} > ${value}`,
    label: 'is greater than'
  },
  greaterThanOrEqualTo: {
    fn: (value, field) => `${field} >= ${value}`,
    label: 'is greater than or equal to'
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
    fn: (value, field) => `${field} < ${value}`,
    label: 'is less than'
  },
  lessThanOrEqualTo: {
    fn: (value, field) => `${field} <= ${value}`,
    label: 'is less than or equal to'
  }
  /*
  'includes': field match '*val*',
  'doesNotInclude'			!(field match '*val*')
  'isEmpty'				defined(field)
  'isNotEmpty'				defined(field)
  */
}

// null values are represented as menu dividers
export const FACETS: (SearchFacetInputProps | null)[] = [
  // Size (with modifiers)
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
      ]
    },
    value: 0
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
  // Divider
  null,
  // Width (with modifiers)
  {
    name: 'width',
    type: 'number',
    title: 'Width',
    field: 'metadata.dimensions.width',
    operatorType: 'greaterThan',
    value: 400
  },
  // Height (with modifiers)
  {
    name: 'height',
    type: 'number',
    title: 'Height',
    field: 'metadata.dimensions.height',
    operatorType: 'greaterThan',
    value: 400
  }
]
