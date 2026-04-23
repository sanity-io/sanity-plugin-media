import {FOLDER_DOCUMENT_NAME} from '../constants'
import {FolderIcon} from '@sanity/icons'

export default {
  title: 'Media Folder',
  icon: FolderIcon,
  name: FOLDER_DOCUMENT_NAME,
  type: 'document',
  fields: [
    {
      title: 'Path',
      name: 'path',
      type: 'string'
    }
  ],
  preview: {
    select: {
      path: 'path'
    },
    prepare(selection: {path?: string}): {
      media: typeof FolderIcon
      subtitle?: string
      title: string
    } {
      const {path} = selection
      return {
        media: FolderIcon,
        title: path?.split('/').pop() || 'Folder',
        subtitle: path
      }
    }
  }
}
