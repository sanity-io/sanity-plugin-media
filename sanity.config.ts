import {defineConfig} from 'sanity'
import {media} from './src'

export default defineConfig({
  name: 'sanity-plugin-media',
  projectId: 'ppsg7ml5',
  dataset: 'test',
  plugins: [media()]
})
