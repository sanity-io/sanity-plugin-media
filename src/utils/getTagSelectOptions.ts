import {ReactSelectOption, TagItem} from '@types'

const getTagSelectOptions = (tags: TagItem[]): ReactSelectOption[] => {
  return tags.reduce((acc: ReactSelectOption[], val) => {
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
