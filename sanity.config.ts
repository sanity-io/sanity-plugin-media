import {defineConfig} from 'sanity'
import {mediaField, media} from './src'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

export default defineConfig({
  name: 'sanity-plugin-media',
  projectId: 'ppsg7ml5',
  dataset: 'test',
  schema: {
    types: [
      {
        name: 'product',
        title: 'Product',
        type: 'document',
        fields: [
          {name: 'name', title: 'Name', type: 'string'},
          mediaField({
            name: 'image',
            title: 'Image',
            type: 'image',
            mediaTags: ['product']
          })
        ]
      }
    ]
  },
  plugins: [media(), structureTool({}), visionTool()]
})
