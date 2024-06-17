import TagIcon from '../components/TagIcon'
import {PROJECT_DOCUMENT_NAME} from '../constants'

export default {
  title: 'Media Project',
  icon: TagIcon,
  name: PROJECT_DOCUMENT_NAME,
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
        media: TagIcon,
        title: name?.current
      }
    }
  }
}
