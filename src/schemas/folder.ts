import {FOLDER_DOCUMENT_NAME} from '../constants'
import {FolderIcon} from '@sanity/icons'

export default {
  title: 'Media Folder',
  icon: FolderIcon,
  name: FOLDER_DOCUMENT_NAME,
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string'
    },
    {
      title: 'Parent',
      name: 'parent',
      type: 'reference',
      to: [{type: FOLDER_DOCUMENT_NAME}],
      weak: true
    }
  ],
  preview: {
    select: {
      name: 'name',
      parentName: 'parent.name'
    },
    prepare(selection: {name?: string; parentName?: string}): {
      media: typeof FolderIcon
      subtitle?: string
      title: string
    } {
      const {name, parentName} = selection
      return {
        media: FolderIcon,
        title: name || 'Folder',
        subtitle: parentName ? `in ${parentName}` : undefined
      }
    }
  }
}
