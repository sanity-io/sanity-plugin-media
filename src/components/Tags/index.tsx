import {Box} from '@sanity/ui'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPicked} from '../../modules/assets'
import {selectTags} from '../../modules/tags'
import TagsAll from '../TagsAll'
import TagsPicked from '../TagsPicked'

const Tags: FC = () => {
  const tags = useTypedSelector(selectTags)

  const pickedAssets = useTypedSelector(selectAssetsPicked)

  return <Box>{pickedAssets?.length > 0 ? <TagsPicked /> : <TagsAll tags={tags} />}</Box>
}

export default Tags
