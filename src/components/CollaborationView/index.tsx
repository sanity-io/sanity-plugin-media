import {Box, Flex, Text} from '@sanity/ui'
import React from 'react'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPickedLength} from '../../modules/assets'
import CollaborationViewHeader from '../CollaborationViewHeader'
import {selectCollaborations} from '../../modules/collaborations'
import CollaborationsVirtualized from '../CollaborationVirtualized'

const CollaborationView = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength)
  const collaborations = useTypedSelector(selectCollaborations)
  const fetching = useTypedSelector(state => state.collaborations.fetching)
  const fetchCount = useTypedSelector(state => state.collaborations.fetchCount)
  const fetchComplete = fetchCount !== -1
  const hasCollaborations = !fetching && collaborations?.length > 0
  const hasPicked = !!(numPickedAssets > 0)

  return (
    <Flex direction="column" flex={1} height="fill">
      <CollaborationViewHeader
        allowCreate
        light={hasPicked}
        title={hasPicked ? 'Collaborations (in selection)' : 'Collaborations'}
      />

      {fetchComplete && !hasCollaborations && (
        <Box padding={3}>
          <Text muted size={1}>
            <em>No Collaborations</em>
          </Text>
        </Box>
      )}

      {hasCollaborations && <CollaborationsVirtualized />}
    </Flex>
  )
}

export default CollaborationView
