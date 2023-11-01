import {Box, Flex, Text} from '@sanity/ui'
import React from 'react'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPickedLength} from '../../modules/assets'
import {selectSeasons} from '../../modules/seasons'
import SeasonsVirtualized from '../SeasonsVirtualized'
import SeasonViewHeader from '../SeasonViewHeader'

const SeasonView = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength)
  const seasons = useTypedSelector(selectSeasons)
  const fetching = useTypedSelector(state => state.seasons.fetching)
  const fetchCount = useTypedSelector(state => state.seasons.fetchCount)
  const fetchComplete = fetchCount !== -1
  const hasTags = !fetching && seasons?.length > 0
  const hasPicked = !!(numPickedAssets > 0)

  return (
    <Flex direction="column" flex={1} height="fill">
      <SeasonViewHeader
        allowCreate
        light={hasPicked}
        title={hasPicked ? 'Seasons (in selection)' : 'Seasons'}
      />

      {fetchComplete && !hasTags && (
        <Box padding={3}>
          <Text muted size={1}>
            <em>No Seasons</em>
          </Text>
        </Box>
      )}

      {hasTags && <SeasonsVirtualized />}
    </Flex>
  )
}

export default SeasonView
