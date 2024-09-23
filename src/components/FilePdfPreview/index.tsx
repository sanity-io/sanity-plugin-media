import {Viewer} from '@react-pdf-viewer/core'
import {thumbnailPlugin} from '@react-pdf-viewer/thumbnail'
import {Asset} from '@types'
import {useRef} from 'react'
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

  const {asset, url, width} = props
  const previewUrl = (asset.opt?.media?.preview as unknown as string) || null

  if (previewUrl) {
    return <img src={previewUrl} style={{height: '100%', margin: '0 auto', display: 'block'}} />
  }

  const thumbnailPluginInstance = thumbnailPlugin({
    renderSpinner: () => <></>
  })
  const {Cover} = thumbnailPluginInstance
  const pageThumbnailPluginInstance = thumbnail({
    PageThumbnail: <Cover getPageIndex={() => 0} width={width} />
  })

  const handleRenderPage = () => {
    setTimeout(() => {
      if (!coverRef.current) {
        return
      }
      const imageUrl = coverRef?.current
        .querySelector('.rpv-thumbnail__cover-image')
        ?.getAttribute('src')

      if (!imageUrl) {
        return
      }

      dispatch(
        assetsActions.updateRequest({
          asset,
          formData: {
            opt: {
              media: {
                tags: asset.opt?.media?.tags || [],
                projects: asset.opt?.media?.projects || [],
                preview: imageUrl
              }
            }
          }
        })
      )
    }, 100)
  }

  return (
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
