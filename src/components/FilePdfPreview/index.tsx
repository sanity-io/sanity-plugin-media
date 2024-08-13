import {Viewer} from '@react-pdf-viewer/core'
import {thumbnailPlugin} from '@react-pdf-viewer/thumbnail'
import {thumbnail} from './thumbnail'

type Props = {
  url: string
  width?: number
}

const FilePdfPreview = (props: Props) => {
  const {url, width} = props

  const thumbnailPluginInstance = thumbnailPlugin()
  const {Cover} = thumbnailPluginInstance
  const pageThumbnailPluginInstance = thumbnail({
    PageThumbnail: <Cover getPageIndex={() => 0} width={width} />
  })

  return <Viewer fileUrl={url} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]} />
}

export default FilePdfPreview
