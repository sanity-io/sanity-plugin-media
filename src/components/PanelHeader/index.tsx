import {black, hues} from '@sanity/color'
import {ComposeIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Label} from '@sanity/ui'
import {TagActions, TagItem} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogShowTagCreate} from '../../modules/dialog'
import Tag from '../Tag'

type Props = {
  actions?: TagActions[]
  allowCreate?: boolean
  tags?: TagItem[]
  title: string
}

const PanelHeader: FC<Props> = (props: Props) => {
  const {actions, allowCreate, tags, title} = props

  // Redux
  const dispatch = useDispatch()
  const tagsCreating = useTypedSelector(state => state.tags.creating)
  const tagsFetching = useTypedSelector(state => state.tags.fetching)

  // Callbacks
  const handleTagCreate = () => {
    dispatch(dialogShowTagCreate())
  }

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        paddingLeft={3}
        style={{
          background: black.hex,
          borderBottom: `1px solid ${hues.gray?.[900].hex}`,
          height: '2.0em',
          position: 'sticky',
          top: 0,
          zIndex: 1 // force stacking context
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
        )}
      </Flex>
      {tags && (
        <Box paddingLeft={3} paddingRight={2}>
          {tags?.map(tagItem => (
            <Tag actions={actions} key={tagItem?.tag?._id} tag={tagItem} />
          ))}
        </Box>
      )}
    </>
  )
}

export default PanelHeader
