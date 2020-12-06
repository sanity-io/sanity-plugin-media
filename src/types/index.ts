import {ReactElement} from 'react'

export type Asset = {
  _id: string
  _updatedAt: string
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
  url: string
}

export type Block = {
  _type: string
  _key: string
  children: Span[]
  markDefs: MarkDef[]
}

export type BrowserFilter = {
  title: string
  value: string
}

export type BrowserOrder = {
  title: string
  value: string
}

export type BrowserView = 'grid' | 'table'

export type ButtonVariant = 'danger' | 'default' | 'secondary'

export type DeleteHandleTarget = 'dialog' | 'snackbar'

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

export type MarkDef = {_key: string; _type: string}

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
