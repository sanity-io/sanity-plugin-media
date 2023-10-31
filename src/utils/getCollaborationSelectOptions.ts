import {SeasonSelectOption} from '@types'
import {CollaborationItem} from '../modules/collaborations'

const getSeasonCollaborationOptions = (tags: CollaborationItem[]): SeasonSelectOption[] => {
  return tags.reduce((acc: SeasonSelectOption[], val) => {
    const collaboration = val?.collaboration
    if (collaboration && collaboration?.name) {
      acc.push({
        label: collaboration?.name?.current,
        value: collaboration?._id
      })
    }
    return acc
  }, [])
}

export default getSeasonCollaborationOptions
