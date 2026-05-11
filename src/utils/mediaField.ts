import type {
  FieldDefinitionBase,
  FileDefinition,
  FileOptions,
  ImageDefinition,
  ImageOptions,
  WidenInitialValue,
  WidenValidation
} from 'sanity'
import {AutoTagInput} from '../components/AutoTagInputWrapper'

type ImageMediaFieldConfig = Omit<ImageDefinition, 'options'> &
  FieldDefinitionBase & {
    name: string
    mediaTags: string[]
    options?: Omit<ImageOptions, 'mediaTags'>
  }

type FileMediaFieldConfig = Omit<FileDefinition, 'options'> &
  FieldDefinitionBase & {
    name: string
    mediaTags: string[]
    options?: Omit<FileOptions, 'mediaTags'>
  }

type MediaFieldResult<T extends {mediaTags: string[]}> = Omit<T, 'mediaTags'> & {
  options: {mediaTags: string[]}
  components: {input: typeof AutoTagInput}
} & WidenValidation &
  WidenInitialValue

/**
 * Defines an image or file field with automatic media tag application when an asset is selected.
 *
 * Pass `mediaTags` at the top level — they are moved into `options.mediaTags` (for media browser
 * pre-filtering) and wire up {@link AutoTagInput} as the field component automatically:
 * ```ts
 * import {mediaField} from 'sanity-plugin-media'
 *
 * mediaField({
 *   name: 'coverImage',
 *   type: 'image',
 *   mediaTags: ['product-cover'],
 *   options: { hotspot: true },
 * })
 * ```
 *
 * For file fields, set `type: 'file'`:
 * ```ts
 * mediaField({ name: 'drawing', type: 'file', mediaTags: ['model-drawing'] })
 * ```
 */
export function mediaField(config: ImageMediaFieldConfig): MediaFieldResult<ImageMediaFieldConfig>
export function mediaField(config: FileMediaFieldConfig): MediaFieldResult<FileMediaFieldConfig>
export function mediaField(
  config: ImageMediaFieldConfig | FileMediaFieldConfig
): MediaFieldResult<ImageMediaFieldConfig> | MediaFieldResult<FileMediaFieldConfig> {
  const {mediaTags, options, components, ...rest} = config as ImageMediaFieldConfig & {
    components?: Record<string, unknown>
  }
  return {
    ...rest,
    options: {...options, mediaTags},
    components: {...components, input: AutoTagInput}
  } as unknown as MediaFieldResult<ImageMediaFieldConfig>
}
