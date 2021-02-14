import {SearchFacetInputProps} from '@types'
import groq from 'groq'

import {operators} from '../config/searchFacets'

const constructFilter = ({
  hasDocument,
  searchFacets,
  searchQuery
}: {
  hasDocument?: boolean
  searchFacets: SearchFacetInputProps[]
  searchQuery?: string
}): string => {
  // Fetch both images and files if being used as a tool
  // Otherwise, only fetch images. Sanity will crash you try and insert a file into an image field!
  const baseFilter = hasDocument
    ? groq`_type == "sanity.imageAsset" && !(_id in path("drafts.**"))`
    : groq`_type in ["sanity.fileAsset", "sanity.imageAsset"] && !(_id in path("drafts.**"))`

  const searchFacetFragments = searchFacets.reduce((acc: string[], facet) => {
    if (facet.type === 'number') {
      const {field, modifier, modifiers, operatorType, value} = facet
      const operator = operators[operatorType]

      // Get current modifier
      const currentModifier = modifiers?.find(m => m.name === modifier)

      // Apply field modifier function (if present)
      const facetField = currentModifier?.fieldModifier
        ? currentModifier.fieldModifier(field)
        : field

      const fragment = operator.fn(value, facetField)
      if (fragment) {
        acc.push(fragment)
      }
    }

    if (facet.type === 'searchable') {
      const {field, operatorType, value} = facet
      const operator = operators[operatorType]

      const fragment = operator.fn(value?.value, field)
      if (fragment) {
        acc.push(fragment)
      }
    }

    if (facet.type === 'select') {
      const {field, operatorType, options, value} = facet
      const operator = operators[operatorType]

      const currentOptionValue = options?.find(l => l.name === value)?.value

      const fragment = operator.fn(currentOptionValue, field)
      if (fragment) {
        acc.push(fragment)
      }
    }

    if (facet.type === 'string') {
      const {field, operatorType, value} = facet
      const operator = operators[operatorType]

      const fragment = operator.fn(value, field)
      if (fragment) {
        acc.push(fragment)
      }
    }

    return acc
  }, [])

  // Join separate filter fragments
  const constructedQuery = [
    // Base filter
    baseFilter,
    // Search query (if present)
    // NOTE: Currently this only searches direct fields on sanity.fileAsset/sanity.imageAsset and NOT referenced tags
    // It's possible to add this by adding the following line to the searchQuery, but it's quite slow
    // references(*[_type == "media.tag" && name.current == "${searchQuery.trim()}"]._id)
    ...(searchQuery
      ? [groq`[altText, description, originalFilename, title] match '*${searchQuery.trim()}*'`]
      : []),
    // Search facets
    ...searchFacetFragments
  ].join(' && ')

  return constructedQuery
}

export default constructFilter
