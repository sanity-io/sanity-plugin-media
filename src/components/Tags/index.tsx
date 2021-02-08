import {Box} from '@sanity/ui'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPickedLength} from '../../modules/assets'
import TagsAll from '../TagsAll'
import TagsPicked from '../TagsPicked'

const Tags: FC = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength)

  return <Box>{numPickedAssets > 0 ? <TagsPicked /> : <TagsAll />}</Box>
}

export default Tags
