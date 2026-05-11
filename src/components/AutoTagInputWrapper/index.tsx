import {useToast} from '@sanity/ui'
import {useEffect, useRef} from 'react'
import {type InputProps} from 'sanity'
import {applyMediaTags} from '../../utils/applyMediaTags'
import {useToolOptions} from '../../contexts/ToolOptionsContext'
import useVersionedClient from '../../hooks/useVersionedClient'

type AssetValue = {
  _type: 'image' | 'file'
  asset?: {
    _ref: string
    _type: 'reference'
  }
}

export type AutoTagInputProps = InputProps & {
  mediaTags?: string[]
}

/**
 * Input component that automatically applies media tags when an asset is selected or uploaded.
 *
 * Apply explicitly to image/file fields that should be auto-tagged:
 * ```ts
 * import {AutoTagInput} from 'sanity-plugin-media'
 *
 * defineField({
 *   type: 'image',
 *   options: { mediaTags: ['product'] },   // also pre-filters the media browser
 *   components: { input: AutoTagInput },
 * })
 * ```
 *
 * Pass `mediaTags` as a prop to override or use without `options`:
 * ```ts
 * components: { input: (props) => <AutoTagInput {...props} mediaTags={['product']} /> }
 * ```
 */
export function AutoTagInput(props: AutoTagInputProps) {
  const {renderDefault, schemaType, value, mediaTags: mediaTagsProp} = props
  const toast = useToast()

  // Prop takes precedence; fall back to schemaType.options.mediaTags (set for browser pre-filtering)
  const mediaTags =
    mediaTagsProp ?? (schemaType?.options as {mediaTags?: string[]} | undefined)?.mediaTags

  const client = useVersionedClient()
  const {createTagsOnUpload} = useToolOptions()

  const prevAssetRef = useRef<string | undefined>(undefined)
  const isInitialMount = useRef(true)

  const currentAssetRef = (value as AssetValue | undefined)?.asset?._ref

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      prevAssetRef.current = currentAssetRef
      return
    }

    const previousRef = prevAssetRef.current
    prevAssetRef.current = currentAssetRef

    if (!mediaTags?.length || !currentAssetRef || currentAssetRef === previousRef) return

    applyMediaTags({
      client,
      assetId: currentAssetRef,
      mediaTags,
      createTagsOnUpload
    }).catch(err => {
      console.error('[sanity-plugin-media] Failed to apply auto-tags:', err)
      const label = mediaTags.length === 1 ? 'tag' : 'tags'
      toast.push({closable: true, status: 'error', title: `Failed to apply the media ${label} ${mediaTags.join(', ')}`})
    })
  }, [currentAssetRef, mediaTags, client, createTagsOnUpload])

  return renderDefault(props as InputProps)
}

export default AutoTagInput
