import {hues} from '@sanity/color'
import {Box, Button, Flex, Inline} from '@sanity/ui'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import {Flex as LegacyFlex} from 'theme-ui'

import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogActions} from '../../modules/dialog'
import {tagsActions} from '../../modules/tags'
import ButtonViewGroup from '../ButtonViewGroup'
import OrderSelect from '../OrderSelect'
import Progress from '../Progress'
import SearchFacets from '../SearchFacets'
import SearchFacetsControl from '../SearchFacetsControl'
import TagIcon from '../TagIcon'
import TextInputSearch from '../TextInputSearch'

const Controls: FC = () => {
  // Redux
  const dispatch = useDispatch()
  const fetching = useTypedSelector(state => state.assets.fetching)
  const pageIndex = useTypedSelector(state => state.assets.pageIndex)
  const searchFacets = useTypedSelector(state => state.search.facets)
  const tagsPanelVisible = useTypedSelector(state => state.tags.panelVisible)

  // Callbacks
  const handleShowSearchFacetDialog = () => {
    dispatch(dialogActions.showSearchFacets())
  }

  const handleShowTagsDialog = () => {
    dispatch(dialogActions.showTags())
  }

  const toggleTagsPanelToggle = () => {
    dispatch(tagsActions.panelVisibleSet({panelVisible: !tagsPanelVisible}))
  }

  return (
    <Box
      paddingY={2}
      style={{
        borderBottom: `1px solid ${hues.gray?.[900].hex}`,
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
          <LegacyFlex
            sx={{
              alignItems: 'flex-start',
              flex: 1,
              height: '100%',
              justifyContent: ['space-between', null, 'flex-start'],
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
                  text={`Filters${searchFacets.length > 0 ? ' (' + searchFacets.length + ')' : ''}`}
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
          </LegacyFlex>
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
                    <TagIcon />
                  </Box>
                }
                onClick={toggleTagsPanelToggle}
                mode={tagsPanelVisible ? 'default' : 'ghost'}
                text={tagsPanelVisible ? 'Tags' : ''}
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
