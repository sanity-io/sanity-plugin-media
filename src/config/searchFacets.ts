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
    assetTypes: ['file', 'image'],
    field: 'altText',
    name: 'altText',
    operatorType: 'empty',
    operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude'],
    title: 'Alt text',
    type: 'string',
    value: ''
  },
  description: {
    assetTypes: ['file', 'image'],
    field: 'description',
    name: 'description',
    operatorType: 'empty',
    operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude'],
    title: 'Description',
    type: 'string',
    value: ''
  },
  fileName: {
    assetTypes: ['file', 'image'],
    field: 'originalFilename',
    name: 'filename',
    operatorType: 'includes',
    operatorTypes: ['includes', 'doesNotInclude'],
    title: 'File name',
    type: 'string',
    value: ''
  },
  height: {
    assetTypes: ['image'],
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
  inCurrentDocument: {
    assetTypes: ['file', 'image'],
    name: 'inCurrentDocument',
    operatorType: 'is',
    options: [
      {
        name: 'true',
        title: 'True',
        value: groq`_id in $documentAssetIds`
      },
      {
        name: 'false',
        title: 'False',
        value: groq`!(_id in $documentAssetIds)`
      }
    ],
    selectOnly: true,
    title: 'In use in current document',
    type: 'select',
    value: 'true'
  },
  inUse: {
    assetTypes: ['file', 'image'],
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
    title: 'In use',
    type: 'select',
    value: 'true'
  },
  isOpaque: {
    assetTypes: ['image'],
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
    title: 'Has transparency',
    type: 'select',
    value: 'true'
  },
  orientation: {
    assetTypes: ['image'],
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
    assetTypes: ['file', 'image'],
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
    title: 'File size',
    type: 'number',
    value: 0
  },
  tag: {
    assetTypes: ['file', 'image'],
    field: 'opt.media.tags',
    name: 'tag',
    operatorType: 'references',
    operatorTypes: ['references', 'doesNotReference', null, 'empty', 'notEmpty'],
    title: 'Tags',
    type: 'searchable'
  },
  title: {
    assetTypes: ['file', 'image'],
    field: 'title',
    name: 'title',
    operatorType: 'empty',
    operatorTypes: ['empty', 'notEmpty', null, 'includes', 'doesNotInclude'],
    title: 'Title',
    type: 'string',
    value: ''
  },
  type: {
    assetTypes: ['file', 'image'],
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
    title: 'File type',
    type: 'select',
    value: 'image'
  },
  width: {
    assetTypes: ['image'],
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
    fn: (value, _field) => (value ? `!references('${value}')` : undefined),
    label: 'does not include'
  },
  empty: {
    fn: (_value, field) => `!defined(${field})`,
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
    fn: (value, _field) => `${value}`,
    label: 'is'
  },
  isNot: {
    fn: (value, _field) => `!(${value})`,
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
    fn: (_value, field) => `defined(${field})`,
    hideInput: true,
    label: 'is not empty'
  },
  references: {
    fn: (value, _field) => (value ? `references('${value}')` : undefined),
    label: 'includes'
  }
}
