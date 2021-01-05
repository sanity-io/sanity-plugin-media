export default {
  title: 'Media Tag',
  name: 'mediaTag',
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
        title: name?.current
      }
    }
  }
}
