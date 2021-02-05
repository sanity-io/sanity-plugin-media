import {ComposeIcon} from '@sanity/icons'
import {Box, Button, Flex, Label} from '@sanity/ui'
import {TagItem} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {dialogShowTagCreate} from '../../modules/dialog'

type Props = {
  tags: TagItem[]
}

const TagsAll: FC<Props> = (props: Props) => {
  const {tags} = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleTagCreate = () => {
    console.log('tag create')
    dispatch(dialogShowTagCreate())
  }

  return (
    <Box>
      <Flex
        align="center"
        justify="space-between"
        paddingLeft={3}
        style={{
          background: '#0F1112', // TODO: use theme colors
          borderBottom: '1px solid #333', // TODO: use theme colors
          height: '2.0em',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <Label size={0}>All Tags ({tags?.length})</Label>

        {/* Create new tag button */}
        <Button
          fontSize={1} //
          icon={ComposeIcon}
          mode="bleed"
          onClick={handleTagCreate}
          style={{
            background: 'transparent',
            boxShadow: 'none'
          }}
          tone="primary"
        />
      </Flex>

      <Box>
        {tags?.map(tag => (
          <Box key={tag?.tag?._id} marginLeft={1}>
            <Button
              fontSize={1}
              justify="flex-start"
              mode="bleed"
              padding={2}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              text={tag?.tag?.name?.current}
            />

            {/*
            <Flex>
              <Button
                fontSize={0}
                icon={EditIcon}
                mode="bleed"
                padding={3}
                style={{
                  opacity: 0.0
                }}
              />
              */}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default TagsAll
