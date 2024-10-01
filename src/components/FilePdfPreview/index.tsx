import {Viewer} from '@react-pdf-viewer/core'
import {thumbnailPlugin} from '@react-pdf-viewer/thumbnail'
import {Asset} from '@types'
import {useEffect, useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import {assetsActions} from '../../modules/assets'
import {thumbnail} from './thumbnail'

type Props = {
  asset: Asset
  url: string
  width?: number
}

const FilePdfPreview = (props: Props) => {
  const coverRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {asset, url, width} = props

  useEffect(() => {
    const _previewUrl = (asset.opt?.media?.preview as unknown as string) || null
    setPreviewUrl(_previewUrl)
  }, [asset])

  const thumbnailPluginInstance = thumbnailPlugin({
    renderSpinner: () => <></>
  })
  const {Cover} = thumbnailPluginInstance
  const pageThumbnailPluginInstance = thumbnail({
    PageThumbnail: <Cover getPageIndex={() => 0} width={width} />
  })

  const saveThumbnail = (thumbnailUrl: string) => {
    dispatch(
      assetsActions.updateRequest({
        asset,
        formData: {
          opt: {
            media: {
              tags: asset.opt?.media?.tags || [],
              projects: asset.opt?.media?.projects || [],
              preview: thumbnailUrl
            }
          }
        }
      })
    )
  }

  const handleRenderPage = () => {
    let timeInterval = 0
    const interval = setInterval(() => {
      if (!coverRef.current) {
        return
      }
      const imageUrl = coverRef?.current
        .querySelector('.rpv-thumbnail__cover-image')
        ?.getAttribute('src')

      if (imageUrl || timeInterval > 30) {
        saveThumbnail(imageUrl as string)
        clearInterval(interval)
      }

      timeInterval++
    }, 500)
  }

  return previewUrl ? (
    <img src={previewUrl} style={{height: '100%', margin: '0 auto', display: 'block'}} />
  ) : (
    <div ref={coverRef} style={{height: '100%'}}>
      <Viewer
        fileUrl={url}
        plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}
        onDocumentLoad={handleRenderPage}
      />
    </div>
  )
}

export default FilePdfPreview
