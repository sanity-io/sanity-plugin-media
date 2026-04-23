import { defineConfig } from 'sanity'
import { media } from './src'

export default defineConfig({
  name: 'sanity-plugin-media',
  projectId: 'xrn5spf3',
  dataset: 'production',
  plugins: [
    media({
      locales: [
        {id: 'en', title: 'English'},
        {id: 'it', title: 'Italiano'}
      ]
    })
  ]
})
