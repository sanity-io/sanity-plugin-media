import {ComposeIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Label} from '@sanity/ui'
import React from 'react'
import {useDispatch} from 'react-redux'
import {useColorScheme} from 'sanity'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'
import {getSchemeColor} from '../../utils/getSchemeColor'

type Props = {
  allowCreate?: boolean
  light?: boolean
  title: string
}

const SeasonViewHeader = ({allowCreate, light, title}: Props) => {
  const {scheme} = useColorScheme()

  const dispatch = useDispatch()
  const tagsCreating = useTypedSelector(state => state.seasons.creating)
  const tagsFetching = useTypedSelector(state => state.seasons.fetching)

  const handleTagCreate = () => {
    dispatch(DIALOG_ACTIONS.showSeasonCreate())
  }

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        paddingLeft={3}
        style={{
          background: light ? getSchemeColor(scheme, 'bg') : 'inherit',
          borderBottom: '1px solid var(--card-border-color)',
          flexShrink: 0,
          height: `${PANEL_HEIGHT}px`
        }}
      >
        <Inline space={2}>
          <Label size={0}>{title}</Label>
          {tagsFetching && (
            <Label size={0} style={{opacity: 0.3}}>
              Loading...
            </Label>
          )}
        </Inline>
        {/* Create new tag button */}
        {allowCreate && (
          <Box marginRight={1}>
            <Button
              disabled={tagsCreating}
              fontSize={1} //
              icon={ComposeIcon}
              mode="bleed"
              onClick={handleTagCreate}
              style={{
                background: 'transparent',
                boxShadow: 'none'
              }}
            />
          </Box>
        )}
      </Flex>
    </>
  )
}

export default SeasonViewHeader
