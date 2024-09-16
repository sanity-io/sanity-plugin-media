import {Viewer} from '@react-pdf-viewer/core'
import {toolbarPlugin, ToolbarSlot, TransformToolbarSlot} from '@react-pdf-viewer/toolbar'

type Props = {
  url: string
}

const transform: TransformToolbarSlot = (slot: ToolbarSlot) => {
  const {NumberOfPages} = slot

  // Override the `NumberOfPages` slot
  return Object.assign({}, slot, {
    NumberOfPages: () => (
      <>
        of <NumberOfPages />
      </>
    ),
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
    Open: () => <></>,
    OpenMenuItem: () => <></>,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    Print: () => <></>,
    PrintMenuItem: () => <></>
  })
}

const FilePdf = (props: Props) => {
  const {url} = props

  const toolbarPluginInstance = toolbarPlugin()
  const {Toolbar, renderDefaultToolbar} = toolbarPluginInstance

  return (
    <div
      className="rpv-core__viewer"
      style={{
        border: '1px solid rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#eeeeee',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          padding: '4px'
        }}
      >
        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <Viewer fileUrl={url} plugins={[toolbarPluginInstance]} />
      </div>
    </div>
  )
}

export default FilePdf
