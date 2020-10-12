import {ReactElement} from 'react'
import {
  AlignItemsProps,
  AlignSelfProps,
  BorderProps,
  ColorProps,
  FlexDirectionProps,
  FlexProps,
  FlexGrowProps,
  FlexShrinkProps,
  FlexWrapProps,
  GridProps,
  JustifyContentProps,
  LayoutProps,
  OverflowProps,
  PositionProps,
  SpaceProps,
  TextColorProps,
  TypographyProps,
  JustifyItemsProps,
  JustifySelfProps
} from 'styled-system'

// Styled-system patch for the color prop fixing "Types of property 'color' are incompatible"
// when applying props to component that extend ColorProps.
// Source: https://stackoverflow.com/questions/53711454/styled-system-props-typing-with-typescript
export interface CustomColorProps extends Omit<ColorProps, 'color'> {
  textColor?: TextColorProps['color']
}

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

export type BoxProps = AlignItemsProps &
  AlignSelfProps &
  BorderProps &
  CustomColorProps &
  FlexDirectionProps &
  FlexGrowProps &
  FlexProps &
  FlexShrinkProps &
  FlexWrapProps &
  GridProps &
  JustifyContentProps &
  JustifyItemsProps &
  JustifySelfProps &
  LayoutProps &
  OverflowProps &
  PositionProps &
  SpaceProps &
  TypographyProps & {
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    boxSizing?: string
    cursor?: string
    gridRowEnd?: string | string[]
    gridRowStart?: string | string[]
    order?: any
    outline?: string
    pointerEvents?: string
    textOverflow?: string
    textTransform?: string
    transform?: string
    transition?: string
    userSelect?: string
    whiteSpace?: string
    // TODO: document
    zIndex?: any
  }

export type BrowserQueryOptions = {
  filter: Filter
  order: {
    title: string
    value: string
  }
  pageIndex: number
  replaceOnFetch: boolean
}

export type BrowserView = {
  icon: Function
  title: string
  value: string
}

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
  _id: string
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

export type Filter = {
  title: string
  value: string
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

export type Span = {
  _key: string
  text: string
  marks: string[]
}
