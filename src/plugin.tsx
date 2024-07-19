import React from 'react'
import {AssetSource, Tool as SanityTool, definePlugin} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import FormBuilderTool from './components/FormBuilderTool'
import Tool from './components/Tool'
import mediaTag from './schemas/tag'
import {MediaToolOptions} from '@types'
import {ToolOptionsProvider} from './contexts/ToolOptionsContext'

const plugin = {
  icon: ImageIcon,
  name: 'media',
  title: 'Media'
}

export const mediaAssetSource = {
  ...plugin,
  component: FormBuilderTool
} satisfies AssetSource

const tool = {
  ...plugin,
  component: Tool
} satisfies SanityTool

export const media = definePlugin<MediaToolOptions | void>(options => ({
  name: 'media',
  studio: {
    components: {
      layout: props => (
        <ToolOptionsProvider options={options}>{props.renderDefault(props)}</ToolOptionsProvider>
      )
    }
  },
  form: {
    file: {
      assetSources: prev => {
        return [...prev, mediaAssetSource]
      }
    },
    image: {
      assetSources: prev => {
        return [...prev, mediaAssetSource]
      }
    }
  },
  schema: {
    types: [mediaTag]
  },
  tools: prev => {
    return [...prev, tool]
  }
}))
