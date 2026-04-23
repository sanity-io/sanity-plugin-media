import {useEffect, useRef} from 'react'
import {useClient, type InputProps} from 'sanity'
import {applyMediaTags} from '../../utils/applyMediaTags'
import {useToolOptions} from '../../contexts/ToolOptionsContext'

type AssetValue = {
  _type: 'image' | 'file'
  asset?: {
    _ref: string
    _type: 'reference'
  }
}

type MediaTagsOptions = {
  mediaTags?: string[]
}

/**
 * Global input wrapper that intercepts image/file inputs to automatically
 * apply media tags when assets are uploaded via the native Sanity upload button.
 * For non-image/file inputs, it simply renders the default component.
 */
function AutoTagInputWrapper(props: InputProps) {
  const {renderDefault, schemaType} = props

  // Check if this is an image or file input
  const typeName = schemaType?.type?.name || schemaType?.name
  const isAssetField = typeName === 'image' || typeName === 'file'

  // Extract mediaTags from field options
  const mediaTags = (schemaType?.options as MediaTagsOptions | undefined)?.mediaTags

  // If not an asset field or no mediaTags configured, just render default
  if (!isAssetField || !mediaTags || mediaTags.length === 0) {
    return renderDefault(props)
  }

  // Render the auto-tag wrapper for asset fields with mediaTags
  return <AutoTagAssetInput {...props} mediaTags={mediaTags} />
}

type AutoTagAssetInputProps = InputProps & {
  mediaTags: string[]
}

/**
 * Inner component that handles the auto-tagging logic for asset fields.
 */
function AutoTagAssetInput(props: AutoTagAssetInputProps) {
  const {renderDefault, value, mediaTags} = props

  const client = useClient({apiVersion: '2022-10-01'})
  const {createTagsOnUpload} = useToolOptions()

  // Track the previous asset ref to detect new uploads
  const prevAssetRef = useRef<string | undefined>(undefined)
  const isInitialMount = useRef(true)

  // Get current asset ref
  const currentAssetRef = (value as AssetValue | undefined)?.asset?._ref

  // Effect to detect when asset ref changes (new upload)
  useEffect(() => {
    // Skip on initial mount - we only want to catch new uploads, not existing values
    if (isInitialMount.current) {
      isInitialMount.current = false
      prevAssetRef.current = currentAssetRef
      return
    }

    const previousRef = prevAssetRef.current
    prevAssetRef.current = currentAssetRef

    // If we have a new asset ref (new upload)
    if (currentAssetRef && currentAssetRef !== previousRef) {
      applyMediaTags({
        client,
        assetId: currentAssetRef,
        mediaTags,
        createTagsOnUpload
      }).catch(err => {
        // Log error but don't break the upload flow
        console.error('[sanity-plugin-media] Failed to apply auto-tags:', err)
      })
    }
  }, [currentAssetRef, mediaTags, client, createTagsOnUpload])

  // Render default - no styling changes, purely functional wrapper
  return renderDefault(props)
}

export default AutoTagInputWrapper
