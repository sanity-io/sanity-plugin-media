import React from 'react'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectCombinedItems} from '../../modules/selectors'
import {Box, Text} from '@sanity/ui'
import {assetsActions} from '../../modules/assets'
import {useDispatch} from 'react-redux'
import ReplaceAssetGridVirtualizedMinimal from '../ReplaceAssetGridVirtualizedMinimal'

const ReplaceAssetsOverview = () => {
  const dispatch = useDispatch()
  const combinedItems = useTypedSelector(selectCombinedItems)
  const fetchCount = useTypedSelector(state => state.assets.fetchCount)
  const fetching = useTypedSelector(state => state.assets.fetching)

  const hasItems = combinedItems.length > 0
  const hasFetchedOnce = fetchCount >= 0
  const isEmpty = !hasItems && hasFetchedOnce && !fetching

  const handleLoadMoreItems = () => {
    if (!fetching) {
      dispatch(assetsActions.loadNextPage())
    }
  }

  return (
    <Box height="fill">
      {isEmpty ? (
        <Box padding={5}>
          <Text size={1} weight="semibold">
            There are no assets
          </Text>
        </Box>
      ) : (
        <Box height="fill">
          <ReplaceAssetGridVirtualizedMinimal
            items={combinedItems}
            onLoadMore={handleLoadMoreItems}
          />
        </Box>
      )}
    </Box>
  )
}

export default ReplaceAssetsOverview
