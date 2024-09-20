import {DocumentsIcon, TagsIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, useMediaIndex} from '@sanity/ui'
import {useDispatch} from 'react-redux'
import {PROJECT_DOCUMENT_NAME, TAG_DOCUMENT_NAME} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogActions} from '../../modules/dialog'
import {tagsActions} from '../../modules/tags'
import ButtonViewGroup from '../ButtonViewGroup'
import OrderSelect from '../OrderSelect'
import Progress from '../Progress'
import SearchFacets from '../SearchFacets'
import SearchFacetsControl from '../SearchFacetsControl'
import TextInputSearch from '../TextInputSearch'

const Controls = () => {
  // Redux
  const dispatch = useDispatch()
  const fetching = useTypedSelector(state => state.assets.fetching)
  const pageIndex = useTypedSelector(state => state.assets.pageIndex)
  const searchFacets = useTypedSelector(state => state.search.facets)
  const tagsPanelVisible = useTypedSelector(state => state.tags.panelVisible)
  const panelType = useTypedSelector(state => state.tags.panelType)

  const mediaIndex = useMediaIndex()

  // Callbacks
  const handleShowSearchFacetDialog = () => {
    dispatch(dialogActions.showSearchFacets())
  }

  const handleShowTagsDialog = () => {
    dispatch(dialogActions.showTags())
  }

  const toggleTagsPanelToggle = (type = 'tags') => {
    let _tagsPanelVisible = !tagsPanelVisible
    if (panelType !== type) {
      _tagsPanelVisible = true
    }

    dispatch(tagsActions.panelVisibleSet({panelVisible: _tagsPanelVisible, panelType: type}))
  }

  return (
    <Box
      paddingY={2}
      style={{
        borderBottom: '1px solid var(--card-border-color)',
        zIndex: 2
      }}
    >
      {/* Rows: search / filters / orders  */}
      <Box marginBottom={2}>
        <Flex
          align="flex-start"
          direction={['column', 'column', 'column', 'column', 'row']}
          justify="space-between"
        >
          {/* Search + Filters */}
          <Flex
            flex={1}
            style={{
              alignItems: 'flex-start',
              flex: 1,
              height: '100%',
              justifyContent: mediaIndex < 2 ? 'space-between' : 'flex-start',
              position: 'relative',
              width: '100%'
            }}
          >
            <Box marginX={2} style={{minWidth: '200px'}}>
              {/* Search */}
              <TextInputSearch />
            </Box>

            <Box display={['none', 'none', 'block']}>
              <SearchFacets />

              {/* Search Facets Control (add / clear) */}
              <SearchFacetsControl />
            </Box>

            <Box display={['block', 'block', 'none']} marginX={2}>
              <Inline space={2} style={{whiteSpace: 'nowrap'}}>
                {/* Filters button (small) */}
                <Button
                  fontSize={1}
                  mode="ghost"
                  onClick={handleShowSearchFacetDialog}
                  text={`Filters${searchFacets.length > 0 ? ` (${searchFacets.length})` : ''}`}
                  tone="primary"
                />

                {/* Tags button (small) */}
                <Button
                  fontSize={1}
                  mode="ghost"
                  onClick={handleShowTagsDialog}
                  text={`Tags`}
                  tone="primary"
                />
              </Inline>
            </Box>
          </Flex>
        </Flex>
      </Box>

      <Box>
        <Flex align="center" justify={['space-between']}>
          {/* Views */}
          <Box marginX={2}>
            <ButtonViewGroup />
          </Box>

          <Flex marginX={2}>
            {/* Orders */}
            <OrderSelect />
            {/* Tags panel toggle */}
            <Box display={['none', 'none', 'block']} marginLeft={2}>
              <Button
                fontSize={1}
                icon={
                  <Box style={{transform: 'scale(0.75)'}}>
                    <TagsIcon width={'1.3em'} height={'1.3em'} />
                  </Box>
                }
                onClick={() => toggleTagsPanelToggle(TAG_DOCUMENT_NAME)}
                mode={tagsPanelVisible && panelType === TAG_DOCUMENT_NAME ? 'default' : 'ghost'}
                text={tagsPanelVisible && panelType === TAG_DOCUMENT_NAME ? 'Tags' : ''}
              />
            </Box>
            {/* Projects panel toggle */}
            <Box display={['none', 'none', 'block']} marginLeft={2}>
              <Button
                fontSize={1}
                icon={
                  <Box style={{transform: 'scale(0.75)'}}>
                    <DocumentsIcon width={'1.3em'} height={'1.3em'} />
                  </Box>
                }
                onClick={() => toggleTagsPanelToggle(PROJECT_DOCUMENT_NAME)}
                mode={tagsPanelVisible && panelType === PROJECT_DOCUMENT_NAME ? 'default' : 'ghost'}
                text={tagsPanelVisible && panelType === PROJECT_DOCUMENT_NAME ? 'Projects' : ''}
              />
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Progress bar */}
      <Progress key={pageIndex} loading={fetching} />
    </Box>
  )
}

export default Controls
