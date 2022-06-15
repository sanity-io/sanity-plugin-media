import {CloseIcon} from '@sanity/icons'
import {Box, Flex, Label, Text} from '@sanity/ui'
import {SearchFacetInputProps} from '@types'
import React, {ReactNode} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import {searchActions} from '../../modules/search'

type Props = {
  children: ReactNode
  facet: SearchFacetInputProps
}

const Container = styled(Box)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.sanity.radius[2]}px;
`

const SearchFacet = (props: Props) => {
  const {children, facet} = props

  // Redux
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(searchActions.facetsRemove({facetName: facet.name}))
  }

  return (
    <Container padding={[2, 2, 1]}>
      <Flex align={['flex-start', 'flex-start', 'center']} direction={['column', 'column', 'row']}>
        {/* Title */}
        <Box paddingBottom={[3, 3, 0]} paddingLeft={1} paddingRight={2} paddingTop={[1, 1, 0]}>
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
          <Box marginLeft={1} paddingX={2}>
            <Text muted size={0}>
              <CloseIcon onClick={handleClose} />
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Container>
  )
}

export default SearchFacet
