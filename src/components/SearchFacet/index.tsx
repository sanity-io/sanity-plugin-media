import {CloseIcon} from '@sanity/icons'
import {Box, Card, Flex, Label, Text} from '@sanity/ui'
import {SearchFacetProps} from '@types'
import React, {FC, ReactNode} from 'react'
import {useDispatch} from 'react-redux'

import {assetsSearchFacetsRemove} from '../../modules/assets'

type Props = {
  children: ReactNode
  facet: SearchFacetProps
}

const SearchFacet: FC<Props> = (props: Props) => {
  const {children, facet} = props

  // Redux
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(assetsSearchFacetsRemove(facet.name))
  }

  return (
    <Card
      padding={1}
      radius={2}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'inline-block'
      }}
    >
      <Flex align="center">
        {/* Title */}
        <Box paddingLeft={1} paddingRight={2}>
          <Label size={0}>{facet.title}</Label>
        </Box>

        {children}

        {/* Close button */}
        <Box paddingLeft={3} paddingRight={2} style={{opacity: 0.75}}>
          <Text size={0}>
            <CloseIcon onClick={handleClose} />
          </Text>
        </Box>
      </Flex>
    </Card>
  )
}

export default SearchFacet
