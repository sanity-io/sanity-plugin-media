import {defineConfig} from 'sanity'
import {media} from './src'

export default defineConfig({
  name: 'sanity-plugin-media',
  projectId: 'z13xc6hl',
  dataset: 'production',
  // projectId: 'ppsg7ml5',
  // dataset: 'test',
  plugins: [
    media({
      locales: [
        {
          title: 'Italian',
          id: 'it'
        },
        {
          title: 'English',
          id: 'en'
        }
      ]
    })
  ]
})
