import type {OrderDirection} from '../types'

const ORDER_DICTIONARY: Record<string, {asc: string; desc: string}> = {
  _createdAt: {
    asc: 'Last created: Oldest first',
    desc: 'Last created: Newest first'
  },
  _updatedAt: {
    asc: 'Last updated: Oldest first',
    desc: 'Last updated: Newest first'
  },
  mimeType: {
    asc: 'MIME type: A to Z',
    desc: 'MIME type: Z to A'
  },
  originalFilename: {
    asc: 'File name: A to Z',
    desc: 'File name: Z to A'
  },
  size: {
    asc: 'File size: Smallest first',
    desc: 'File size: Largest first'
  }
}

export const getOrderTitle = (field: string, direction: OrderDirection): string => {
  return ORDER_DICTIONARY[field][direction]
}
