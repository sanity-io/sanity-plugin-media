import {AnyAction} from '@reduxjs/toolkit'
import type {
  SanityAssetDocument,
  SanityClient,
  SanityDocument,
  SanityImageAssetDocument
} from '@sanity/client'
import type {Epic} from 'redux-observable'
import {RootReducerState} from '../modules/types'

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
  assetTypes: AssetType[]
  name: string
  operatorType: SearchFacetOperatorType
  operatorTypes?: (SearchFacetOperatorType | null)[]
  selectOnly?: boolean
  title: string
}

export type Asset = FileAsset | ImageAsset

export type AssetItem = {
  _type: 'asset'
  asset: Asset
  error?: string
  picked: boolean
  updating: boolean
}

export type AssetType = 'file' | 'image'

export type Block = {
  _type: string
  _key: string
  children: Span[]
  markDefs: MarkDef[]
}

export type BrowserView = 'grid' | 'table'

export type ButtonVariant = 'danger' | 'default' | 'secondary'

// TODO: rename
export type CardAssetData = {
  id: string
  type: 'asset'
}

export type CardUploadData = {
  id: string
  type: 'upload'
}

export type Dialog =
  | DialogAssetEditProps
  | DialogConfirmProps
  | DialogSearchFacetsProps
  | DialogTagCreateProps
  | DialogTagEditProps
  | DialogTagsProps

export type DialogAction = 'deleteAsset' | 'deleteTag'

export type DialogAssetEditProps = {
  assetId?: string
  closeDialogId?: string
  id: string
  lastCreatedTag?: {
    label: string
    value: string
  }
  lastRemovedTagIds?: string[]
  type: 'assetEdit'
}

export type DialogConfirmProps = {
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

export type DialogSearchFacetsProps = {
  closeDialogId?: string
  id: string
  type: 'searchFacets'
}

export type DialogTagsProps = {
  closeDialogId?: string
  id: string
  type: 'tags'
}

export type DialogTagCreateProps = {
  closeDialogId?: string
  id: string
  type: 'tagCreate'
}

export type DialogTagEditProps = {
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

export type MyEpic = Epic<
  AnyAction,
  AnyAction,
  RootReducerState,
  {
    client: SanityClient
  }
>

export type Order = {
  direction: OrderDirection
  field: string
}

export type OrderDirection = 'asc' | 'desc'

export type ReactSelectOption = {
  label: string
  value: string
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
  | 'fileName'
  | 'height'
  | 'inCurrentDocument'
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

export type SanityUploadCompleteEvent = {
  asset: SanityAssetDocument | SanityImageAssetDocument
  id: string
  type: 'complete'
}

export type SanityUploadProgressEvent = {
  lengthComputable: boolean
  loaded: number
  percent: number
  stage: 'download' | 'upload'
  total: number
  type: 'progress'
}

export type SanityUploadResponseEvent = {
  body: {document: Partial<SanityAssetDocument | SanityImageAssetDocument>}
  headers: Record<string, string>
  method: string
  statusCode: number
  statusMessage: string
  type: 'response'
  url: string // preview image?
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
  _type: 'tag'
  tag: Tag
  error?: HttpError
  picked: boolean
  updating: boolean
}

export type UploadItem = {
  _type: 'upload'
  assetType: AssetType
  hash: string
  name: string
  objectUrl?: string
  percent?: number
  size: number
  status: 'complete' | 'queued' | 'uploading'
}
