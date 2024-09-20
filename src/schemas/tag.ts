import {TagsIcon} from '@sanity/icons'
import {TAG_DOCUMENT_NAME} from '../constants'

export default {
  title: 'Media Tag',
  icon: TagsIcon,
  name: TAG_DOCUMENT_NAME,
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'slug'
    }
  ],
  preview: {
    select: {
      name: 'name'
    },
    prepare(selection: any) {
      const {name} = selection
      return {
        media: TagsIcon,
        title: name?.current
      }
    }
  }
}
