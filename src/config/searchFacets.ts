import {
  SearchFacetDivider,
  SearchFacetInputProps,
  SearchFacetName,
  SearchFacetOperators
} from '@types'
import groq from 'groq'

export const divider: SearchFacetDivider = {type: 'divider'}

export const inputs: Record<SearchFacetName, SearchFacetInputProps> = {
  altText: {
    contexts: 'all',
    field: 'altText',
    name: 'altText',
    operatorType: 'empty',
    operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude'],
    title: 'Alt Text',
    type: 'string',
    value: ''
  },
  description: {
    contexts: 'all',
    field: 'description',
    name: 'description',
    operatorType: 'empty',
    operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude'],
    title: 'Description',
    type: 'string',
    value: ''
  },
  height: {
    contexts: ['image', 'tool'],
    field: 'metadata.dimensions.height',
    name: 'height',
    operatorType: 'greaterThan',
    operatorTypes: [
      'greaterThan',
      'greaterThanOrEqualTo',
      'lessThan',
      'lessThanOrEqualTo',
      null,
      'equalTo'
    ],
    title: 'Height',
    type: 'number',
    value: 400
  },
  inUse: {
    contexts: 'all',
    name: 'inUse',
    operatorType: 'is',
    options: [
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
    title: 'In Use',
    type: 'select',
    value: 'true'
  },
  isOpaque: {
    contexts: ['image', 'tool'],
    field: 'metadata.isOpaque',
    name: 'isOpaque',
    operatorType: 'equalTo',
    options: [
      {
        name: 'true',
        title: 'True',
        value: `false`
      },
      {
        name: 'false',
        title: 'False',
        value: `true`
      }
    ],
    title: 'Has Transparency',
    type: 'select',
    value: 'true'
  },
  orientation: {
    contexts: ['image', 'tool'],
    name: 'orientation',
    operatorType: 'is',
    operatorTypes: ['is', 'isNot'],
    options: [
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
    title: 'Orientation',
    type: 'select',
    value: 'portrait'
  },
  size: {
    contexts: 'all',
    field: 'size',
    modifier: 'kb',
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
    name: 'size',
    operatorType: 'greaterThan',
    operatorTypes: [
      'greaterThan',
      'greaterThanOrEqualTo',
      'lessThan',
      'lessThanOrEqualTo',
      null,
      'equalTo'
    ],
    title: 'File Size',
    type: 'number',
    value: 0
  },
  tag: {
    contexts: 'all',
    field: 'opt.media.tags',
    name: 'tag',
    operatorType: 'references',
    operatorTypes: ['references', 'doesNotReference', null, 'empty', 'notEmpty'],
    title: 'Tags',
    type: 'searchable'
  },
  title: {
    contexts: 'all',
    field: 'title',
    name: 'title',
    operatorType: 'empty',
    operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude'],
    title: 'Title',
    type: 'string',
    value: ''
  },
  type: {
    contexts: ['file', 'tool'],
    name: 'type',
    operatorType: 'is',
    operatorTypes: ['is', 'isNot'],
    options: [
      {
        name: 'image',
        title: 'Image',
        value: 'mimeType match "image*"'
      },
      {
        name: 'video',
        title: 'Video',
        value: 'mimeType match "video*"'
      },
      {
        name: 'audio',
        title: 'Audio',
        value: 'mimeType match "audio*"'
      },
      {
        name: 'pdf',
        title: 'PDF',
        value: 'mimeType == "application/pdf"'
      }
    ],
    title: 'File Type',
    type: 'select',
    value: 'image'
  },
  width: {
    contexts: ['image', 'tool'],
    field: 'metadata.dimensions.width',
    name: 'width',
    operatorType: 'greaterThan',
    operatorTypes: [
      'greaterThan',
      'greaterThanOrEqualTo',
      'lessThan',
      'lessThanOrEqualTo',
      null,
      'equalTo'
    ],
    title: 'Width',
    type: 'number',
    value: 400
  }
}

export const operators: SearchFacetOperators = {
  doesNotInclude: {
    fn: (value, field) => (value ? `!(${field} match '*${value}*')` : undefined),
    label: 'does not include'
  },
  doesNotReference: {
    fn: (value, _) => (value ? `!references('${value}')` : undefined),
    label: 'does not include'
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
    fn: (value, _) => `${value}`,
    label: 'is'
  },
  isNot: {
    fn: (value, _) => `!(${value})`,
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
