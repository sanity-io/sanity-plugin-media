import {CloseIcon} from '@sanity/icons'
import {Box, Flex, Label, rem, Text, type Theme, type ThemeColorSchemeKey} from '@sanity/ui'
import type {SearchFacetInputProps, WithId} from '../../types'
import {type ReactNode} from 'react'
import {useDispatch} from 'react-redux'
import {useColorScheme} from 'sanity'
import {styled, css} from 'styled-components'
import {searchActions} from '../../modules/search'
import {getSchemeColor} from '../../utils/getSchemeColor'

type Props = {
  children: ReactNode
  facet: WithId<SearchFacetInputProps>
}

// @ts-expect-error - fix typings later
const Container = styled(Box)(({scheme, theme}: {scheme: ThemeColorSchemeKey; theme: Theme}) => {
  return css`
    background: ${getSchemeColor(scheme, 'bg')};
    border-radius: ${rem(theme.sanity.radius[2])};
  `
})

const SearchFacet = (props: Props) => {
  const {children, facet} = props

  const {scheme} = useColorScheme()

  // Redux
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(searchActions.facetsRemoveById({facetId: facet.id}))
  }

  return (
    <Container
      padding={[2, 2, 1]}
      // @ts-expect-error - fix typings later
      scheme={scheme}
    >
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
