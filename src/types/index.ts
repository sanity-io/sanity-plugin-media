import {ReactElement} from 'react'

export type Asset = {
  _id: string
  _updatedAt: string
  altText: string // non-standard
  description: string // non-standard
  extension: string
  metadata: {
    isOpaque: boolean
    dimensions: {
      aspectRatio: number
      height: number
      width: number
    }
  }
  mimeType: string
  originalFilename: string
  size: number
  title: string // non-standard
  url: string
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

export type ComparisonOperator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte'

export type ComparisonOperatorMapping = Record<
  ComparisonOperator,
  {
    label: string
    value: string
  }
>

export type Dialog = {
  asset?: Asset
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

export type FetchOptions = {
  filter?: string
  params?: Record<string, string>
  projections?: string
  replace?: boolean
  selector?: string
  sort?: string
}

export type Item = {
  asset: Asset
  errorCode?: number
  picked: boolean
  updating: boolean
}

export type LogicalOperator = 'is' | 'not'

export type LogicalOperatorMapping = Record<LogicalOperator, string>

export type MarkDef = {_key: string; _type: string}

export type Order = {
  direction: 'asc' | 'desc'
  field: string
}

export type SearchFacetNumberModifier = {
  // TODO: use correct type
  fn: (val: any) => any
  name: string
  title: string
}

export type SearchFacetNumberProps = {
  field: string
  modifier?: string
  name: string
  operators: {
    comparison: ComparisonOperator
  }
  options?: {
    modifiers: SearchFacetNumberModifier[]
  }
  title: string
  type: 'number'
  value?: number
}

export type SearchFacetSelectProps = {
  name: string
  title: string
  type: 'select'
  operators: {
    logical?: LogicalOperator
  }
  options?: {
    list: SearchFacetSelectListItemProps[]
    logical?: boolean
  }
  value: string
}

export type SearchFacetSelectListItemProps = {
  name: string
  title: string
  value: string
}

export type SearchFacetProps = SearchFacetNumberProps | SearchFacetSelectProps

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
