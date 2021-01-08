import {SanityAssetDocument, SanityDocument, SanityImageAssetDocument} from '@sanity/client'
import {ReactElement} from 'react'

type CustomFields = {
  altText?: string
  description?: string
  tags?: SanityReference[]
  title?: string
}

export type Asset = FileAsset | ImageAsset

export type AssetItem = {
  asset: FileAsset | ImageAsset
  errorCode?: number
  picked: boolean
  updating: boolean
}

export type Block = {
  _type: string
  _key: string
  children: Span[]
  markDefs: MarkDef[]
}

export type BrowserSelect = {
  order: Order
  title: string
}

export type BrowserView = 'grid' | 'table'

export type ButtonVariant = 'danger' | 'default' | 'secondary'

export type Dialog = DialogDeleteConfirm | DialogDetails | DialogSearchFacets

export type DialogDeleteConfirm = {
  assetId?: string
  closeDialogId?: string
  id: string
  type: 'deleteConfirm'
}

export type DialogDetails = {
  assetId?: string
  closeDialogId?: string
  id: string
  lastCreatedTagId?: string
  type: 'details'
}

export type DialogSearchFacets = {
  closeDialogId?: string
  id: string
  type: 'searchFacets'
}

export type DialogAction = {
  callback: () => void
  disabled?: boolean
  icon?: ReactElement
  title: string
  variant?: ButtonVariant
}

export type Document = {
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
  name?: string
  title?: string
}

export type FileAsset = SanityAssetDocument &
  CustomFields & {
    _type: 'sanity.fileAsset'
  }

export type ImageAsset = SanityImageAssetDocument &
  CustomFields & {
    _type: 'sanity.imageAsset'
  }

export type MarkDef = {_key: string; _type: string}

export type Order = {
  direction: 'asc' | 'desc'
  field: string
}

export type SanityReference = {
  _ref: string
  _type: 'reference'
  _weak?: boolean
}

export type SearchFacetInputProps =
  | SearchFacetInputNumberProps
  | SearchFacetInputSearchableProps
  | SearchFacetInputSelectProps
  | SearchFacetInputStringProps

export type SearchFacetInputNumberModifier = {
  fieldModifier?: (fieldName: string) => string
  name: string
  title: string
}

export type SearchFacetInputNumberProps = {
  field: string
  modifier?: string
  name: string
  operatorType: SearchFacetOperatorType
  options?: {
    modifiers?: SearchFacetInputNumberModifier[]
    operatorTypes?: (SearchFacetOperatorType | null)[]
  }
  title: string
  type: 'number'
  value?: number
}

export type SearchFacetInputSearchableProps = {
  field: string
  name: string
  operatorType: SearchFacetOperatorType
  options?: {
    list?: SearchFacetInputSelectListItemProps[]
    operatorTypes?: (SearchFacetOperatorType | null)[]
  }
  title: string
  type: 'searchable'
  value?: ReactSelectOption
}

export type SearchFacetInputSelectProps = {
  name: string
  operatorType: SearchFacetOperatorType
  options?: {
    list?: SearchFacetInputSelectListItemProps[]
    operatorTypes?: (SearchFacetOperatorType | null)[]
  }
  title: string
  type: 'select'
  value: string
}

export type SearchFacetInputSelectListItemProps = {
  name: string
  title: string
  value: string
}

export type SearchFacetInputStringProps = {
  field: string
  modifier?: string
  name: string
  operatorType: SearchFacetOperatorType
  options?: {
    operatorTypes?: (SearchFacetOperatorType | null)[]
  }
  title: string
  type: 'string'
  value?: string
}

export type SearchFacetOperatorType =
  | 'doesNotInclude'
  | 'doesNotReference'
  | 'empty'
  | 'equalTo'
  | 'greaterThan'
  | 'greaterThanOrEqualTo'
  | 'includes'
  | 'is'
  | 'isNot'
  | 'lessThan'
  | 'lessThanOrEqualTo'
  | 'notEmpty'
  | 'references'

export type SearchFacetOperators = Record<
  SearchFacetOperatorType,
  {
    fn: (value: number | string | undefined, field?: string) => string | undefined
    hideInput?: boolean
    label: string
  }
>

export type SelectedAsset = {
  assetDocumentProps?: {originalFilename?: string; source?: string; sourceId?: string}
  kind: 'assetDocumentId' | 'base64' | 'file' | 'url'
  value: string | File
}

export type ReactSelectOption = {
  label: string
  value: string
}

export type Span = {
  _key: string
  text: string
  marks: string[]
}

export type Tag = SanityDocument & {
  name: {
    _type: 'slug'
    current: string
  }
}

export type TagItem = {
  tag: Tag
  errorCode?: number
  picked: boolean
  updating: boolean
}
