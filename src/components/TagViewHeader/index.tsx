import {black, hues} from '@sanity/color'
import {ComposeIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Label} from '@sanity/ui'
import React from 'react'
import {useDispatch} from 'react-redux'
import {PANEL_HEIGHT} from '../../constants'
import useTypedSelector from '../../hooks/useTypedSelector'
import {DIALOG_ACTIONS} from '../../modules/dialog/actions'

type Props = {
  allowCreate?: boolean
  light?: boolean
  title: string
}

const TagViewHeader = (props: Props) => {
  const {allowCreate, light, title} = props

  // Redux
  const dispatch = useDispatch()
  const tagsCreating = useTypedSelector(state => state.tags.creating)
  const tagsFetching = useTypedSelector(state => state.tags.fetching)

  // Callbacks
  const handleTagCreate = () => {
    dispatch(DIALOG_ACTIONS.showTagCreate())
  }

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        paddingLeft={3}
        style={{
          background: light ? hues.gray?.[900].hex : black.hex,
          borderBottom: `1px solid ${hues.gray?.[900].hex}`,
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

export default TagViewHeader
