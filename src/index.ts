import {EditIcon, ImageIcon} from '@sanity/icons'
import type {AssetSource} from 'sanity'
import {definePlugin, Tool as SanityTool} from 'sanity'
import EditAssetTool from './components/EditAssetTool'
import FormBuilderTool from './components/FormBuilderTool'
import Tool from './components/Tool'
import mediaTag from './schemas/tag'

const plugin = {
  icon: ImageIcon,
  name: 'media',
  title: 'Media'
}

export const mediaAssetSource: AssetSource = {
  ...plugin,
  component: FormBuilderTool
}

const editMediaAssetSource: AssetSource = {
  icon: EditIcon,
  title: 'Edit Media',
  name: 'edit-media',
  component: EditAssetTool
}

const tool = {
  ...plugin,
  component: Tool
} as SanityTool

export const media = definePlugin({
  name: 'media',
  form: {
    file: {
      assetSources: prev => {
        return [...prev, mediaAssetSource, editMediaAssetSource]
      }
    },
    image: {
      assetSources: prev => {
        return [...prev, mediaAssetSource, editMediaAssetSource]
      }
    }
  },
  schema: {
    types: [mediaTag]
  },
  tools: prev => {
    return [...prev, tool]
  }
})
