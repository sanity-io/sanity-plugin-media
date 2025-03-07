import type {TagSelectOption, TagItem} from '../types'

const getTagSelectOptions = (tags: TagItem[]): TagSelectOption[] => {
  return tags.reduce((acc: TagSelectOption[], val) => {
    const tag = val?.tag
    if (tag) {
      acc.push({
        label: tag?.name?.current,
        value: tag?._id
      })
    }
    return acc
  }, [])
}

export default getTagSelectOptions
