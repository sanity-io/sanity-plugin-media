import {SanityAssetDocument, SanityDocument, SanityImageAssetDocument} from '@sanity/client'
import {AnyAction} from 'redux'

type CustomFields = {
  altText?: string
  description?: string
  opt?: {
    media?: {
      tags?: SanityReference[]
    }
  }
  title?: string
}

type SearchFacetInputCommon = {
  contexts: 'all' | ('file' | 'image' | 'tool')[]
  name: string
  operatorType: SearchFacetOperatorType
  operatorTypes?: (SearchFacetOperatorType | null)[]
  title: string
}

export type Asset = FileAsset | ImageAsset

export type AssetItem = {
  asset: Asset
  error?: HttpError
  picked: boolean
  updating: boolean
}

export type Block = {
  _type: string
  _key: string
  children: Span[]
  markDefs: MarkDef[]
}

export type BrowserView = 'grid' | 'table'

export type ButtonVariant = 'danger' | 'default' | 'secondary'

export type Dialog =
  | DialogAssetEdit
  | DialogConfirm
  | DialogSearchFacets
  | DialogTagCreate
  | DialogTagEdit
  | DialogTags

export type DialogAction = 'deleteAsset' | 'deleteTag'

export type DialogAssetEdit = {
  assetId?: string
  closeDialogId?: string
  id: string
  lastCreatedTagId?: string
  type: 'assetEdit'
}

export type DialogConfirm = {
  closeDialogId?: string
  confirmCallbackAction: AnyAction // TODO: reconsider
  confirmText: string
  description?: string
  headerTitle: string
  id: string
  title: string
  tone: 'critical' | 'primary'
  type: 'confirm'
}

export type DialogSearchFacets = {
  closeDialogId?: string
  id: string
  type: 'searchFacets'
}

export type DialogTags = {
  closeDialogId?: string
  id: string
  type: 'tags'
}

export type DialogTagCreate = {
  closeDialogId?: string
  id: string
  type: 'tagCreate'
}

export type DialogTagEdit = {
  closeDialogId?: string
  id: string
  tagId?: string
  type: 'tagEdit'
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

export type HttpError = {
  message: string
  statusCode: number
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
  direction: OrderDirection
  field: string
}

export type OrderDirection = 'asc' | 'desc'

export type SanityCustomAssetSourceProps = {
  document?: SanityDocument
  onClose?: () => void
  onSelect?: () => void
  selectedAssets?: (SanityAssetDocument | SanityImageAssetDocument)[]
  tool?: string
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

export type SearchFacetDivider = {
  type: 'divider'
}

export type SearchFacetGroup = {
  facets: (SearchFacetDivider | SearchFacetGroup | SearchFacetInputProps)[]
  title: string
  type: 'group'
}

export type SearchFacetInputNumberModifier = {
  fieldModifier?: (fieldName: string) => string
  name: string
  title: string
}

export type SearchFacetInputNumberProps = SearchFacetInputCommon & {
  field: string
  modifier?: string
  modifiers?: SearchFacetInputNumberModifier[]
  type: 'number'
  value?: number
}

export type SearchFacetInputSearchableProps = SearchFacetInputCommon & {
  field: string
  name: string
  options?: SearchFacetInputSelectListItemProps[]
  type: 'searchable'
  value?: ReactSelectOption
}

export type SearchFacetInputSelectProps = SearchFacetInputCommon & {
  field?: string
  options: SearchFacetInputSelectListItemProps[]
  type: 'select'
  value: string
}

export type SearchFacetInputSelectListItemProps = {
  name: string
  title: string
  value: string
}

export type SearchFacetInputStringProps = SearchFacetInputCommon & {
  field: string
  modifier?: string
  type: 'string'
  value?: string
}

export type SearchFacetName =
  | 'altText'
  | 'description'
  | 'height'
  | 'inUse'
  | 'isOpaque'
  | 'orientation'
  | 'size'
  | 'tag'
  | 'title'
  | 'type'
  | 'width'

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

export type TagActions = 'applyAll' | 'delete' | 'edit' | 'removeAll' | 'search'

export type TagItem = {
  tag: Tag
  error?: HttpError
  picked: boolean
  updating: boolean
}
