import {Block} from '@types'

const defaults = {nonTextBehavior: 'remove'}

// Serialize portable text to plain text
// Based off: https://www.sanity.io/docs/presenting-block-text#plain-text-serialization

export default function (blocks: string | Block[] = '', opts = {}) {
  if (typeof blocks === 'string') {
    return blocks
  }

  if (!Array.isArray(blocks)) {
    return ''
  }

  const options = Object.assign({}, defaults, opts)
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
      }

      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}
