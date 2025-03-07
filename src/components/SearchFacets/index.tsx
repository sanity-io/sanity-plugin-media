import {Box, Flex, Inline, rem, type Theme} from '@sanity/ui'

import {styled, css} from 'styled-components'

import useTypedSelector from '../../hooks/useTypedSelector'
import SearchFacetNumber from '../SearchFacetNumber'
import SearchFacetSelect from '../SearchFacetSelect'
import SearchFacetString from '../SearchFacetString'
import SearchFacetTags from '../SearchFacetTags'

type Props = {
  layout?: 'inline' | 'stack'
}

const StackContainer = styled(Flex)(({theme}: {theme: Theme}) => {
  return css`
    > * {
      margin-bottom: ${rem(theme.sanity.space[2])};
    }
  `
})

const SearchFacets = (props: Props) => {
  const {layout = 'inline'} = props

  // Redux
  const searchFacets = useTypedSelector(state => state.search.facets)

  const Items = searchFacets.map(facet => {
    const key = facet.id
    if (facet.type === 'number') {
      return <SearchFacetNumber facet={facet} key={key} />
    }

    if (facet.type === 'searchable') {
      return <SearchFacetTags facet={facet} key={key} />
    }

    if (facet.type === 'select') {
      return <SearchFacetSelect facet={facet} key={key} />
    }

    if (facet.type === 'string') {
      return <SearchFacetString facet={facet} key={key} />
    }

    return null
  })

  if (layout === 'inline') {
    if (searchFacets.length === 0) {
      return null
    }

    return (
      <Box marginBottom={2}>
        <Inline space={2}>{Items}</Inline>
      </Box>
    )
  }

  if (layout === 'stack') {
    return (
      <StackContainer align="flex-start" direction="column">
        {Items}
      </StackContainer>
    )
  }

  throw Error('Invalid layout')
}

export default SearchFacets
