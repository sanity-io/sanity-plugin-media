import {COLLABORATION_DOCUMENT_NAME} from '../constants'
import TagIcon from '../components/TagIcon'

export default {
  title: 'Drops',
  icon: TagIcon,
  name: COLLABORATION_DOCUMENT_NAME,
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
