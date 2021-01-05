import {SanityDocument, SanityImageAssetDocument} from '@sanity/client'
import {ReactElement} from 'react'

export type Asset = SanityImageAssetDocument & {
  altText: string
  description: string
  title: string
}

export type AssetItem = {
  asset: Asset
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

export type Dialog = {
  assetId?: string
  closeDialogId?: string
  id: string
  type: DialogType
}

export type DialogAction = {
  callback: () => void
  disabled?: boolean
  icon?: ReactElement
  title: string
  variant?: ButtonVariant
}

export type DialogType = 'deleteConfirm' | 'deletePickedConfirm' | 'details' | 'searchFacets'

export type Document = {
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
  name?: string
  title?: string
}

export type MarkDef = {_key: string; _type: string}

export type Order = {
  direction: 'asc' | 'desc'
  field: string
}

export type SearchFacetInputProps =
  | SearchFacetInputNumberProps
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

export type SearchFacetInputSelectProps = {
  name: string
  title: string
  type: 'select'
  operatorType: SearchFacetOperatorType
  options?: {
    list?: SearchFacetInputSelectListItemProps[]
    operatorTypes?: (SearchFacetOperatorType | null)[]
  }
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

export type SelectItem = {
  title: string
  value: string
}

export type Span = {
  _key: string
  text: string
  marks: string[]
}

export type Tag = SanityDocument & {
  name: string
}

export type TagItem = {
  tag: Tag
  errorCode?: number
  picked: boolean
  updating: boolean
}
