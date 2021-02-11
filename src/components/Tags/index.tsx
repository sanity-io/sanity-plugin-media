import {black} from '@sanity/color'
import {Box} from '@sanity/ui'
import React, {FC} from 'react'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPickedLength} from '../../modules/assets'
import TagsAll from '../TagsAll'
import TagsPicked from '../TagsPicked'

const Tags: FC = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength)

  return (
    <Box
      flex={1}
      style={{
        // background: hues.gray[950].hex,
        background: black.hex,
        height: '100%'
      }}
    >
      {numPickedAssets > 0 ? <TagsPicked /> : <TagsAll />}
      {/* <TagsPicked /> */}
    </Box>
  )
}

export default Tags
