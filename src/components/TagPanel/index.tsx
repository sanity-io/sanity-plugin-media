import {Box, Flex, Label} from '@sanity/ui'
import {TagActions, TagItem} from '@types'
import React, {FC} from 'react'

import Tag from '../Tag'

type Props = {
  actions?: TagActions[]
  tags?: TagItem[]
  title?: string
}

const TagPanel: FC<Props> = (props: Props) => {
  const {actions, tags, title} = props

  return (
    <>
      {title && (
        <Flex
          align="center"
          justify="space-between"
          paddingBottom={2}
          paddingLeft={3}
          paddingTop={3}
        >
          <Label size={0}>{title}</Label>
        </Flex>
      )}

      {tags && (
        <Box marginBottom={3} paddingLeft={3} paddingRight={2}>
          {tags?.map(tagItem => (
            <Tag actions={actions} key={tagItem?.tag?._id} tag={tagItem} />
          ))}
        </Box>
      )}
    </>
  )
}

export default TagPanel
