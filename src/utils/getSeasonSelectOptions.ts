import {SeasonSelectOption} from '@types'
import {SeasonItem} from '../modules/seasons'

const getSeasonSelectOptions = (tags: SeasonItem[]): SeasonSelectOption[] => {
  return tags.reduce((acc: SeasonSelectOption[], val) => {
    const season = val?.season
    if (season) {
      acc.push({
        label: season?.name?.current,
        value: season?._id
      })
    }
    return acc
  }, [])
}

export default getSeasonSelectOptions
