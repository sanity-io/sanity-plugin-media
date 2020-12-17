import {CloseIcon} from '@sanity/icons'
import {Box, Flex, Label, Text} from '@sanity/ui'
import {SearchFacetProps} from '@types'
import React, {FC, ReactNode} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import {assetsSearchFacetsRemove} from '../../modules/assets'

type Props = {
  children: ReactNode
  facet: SearchFacetProps
}

const Container = styled(Box)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.sanity.radius[2]}px;
`

const SearchFacet: FC<Props> = (props: Props) => {
  const {children, facet} = props

  // Redux
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(assetsSearchFacetsRemove(facet.name))
  }

  return (
    <Container padding={[2, 2, 2, 1]}>
      <Flex
        align={['flex-start', 'flex-start', 'flex-start', 'center']}
        direction={['column', 'column', 'column', 'row']}
      >
        {/* Title */}
        <Box
          paddingBottom={[3, 3, 3, 0]}
          paddingLeft={1}
          paddingRight={2}
          paddingTop={[1, 1, 1, 0]}
        >
          <Label
            size={0}
            style={{
              whiteSpace: 'nowrap'
            }}
          >
            {facet.title}
          </Label>
        </Box>

        <Flex align="center">
          {children}

          {/* Close button */}
          <Box paddingLeft={3} paddingRight={2} style={{opacity: 0.75}}>
            <Text size={0}>
              <CloseIcon onClick={handleClose} />
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Container>
  )
}

export default SearchFacet
