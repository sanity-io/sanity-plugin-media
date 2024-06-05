import {AssetType, SearchFacetInputProps} from '@types'
import groq from 'groq'

import {operators} from '../config/searchFacets'

const constructFilter = ({
  assetTypes,
  searchFacets,
  searchQuery
}: {
  assetTypes: AssetType[]
  searchFacets: SearchFacetInputProps[]
  searchQuery?: string
}): string => {
  // Fetch asset types depending on current context.
  // Either limit to a specific type (if being used as a custom asset source) or fetch both files and images (if being used as a tool)
  // Sanity will crash if you try and insert incompatible asset types into fields!
  const documentAssetTypes = assetTypes.map(type => `sanity.${type}Asset`)

  const tagsRefs = {
    us: "2yXnm4mew8QvsGqhdMhYHY",
    br: "L9kJ2ltVJF2K9EcyKNB9pV",
    ua: "9q4DLwlx4GaCDdOE1fIe3s",
    gb: "ISMpGAlllEDUeg1EmZjul4",
    co: "ISMpGAlllEDUeg1EmZjuyX",
    de: "ISMpGAlllEDUeg1EmZjv6c",
    ar: "9q4DLwlx4GaCDdOE1fIdsV",
    tr: "NlvmxH0U7Vz33q3WYVbACf",
    ae: "QFupi900N8MGZiKkhuHeFl",
    ca: "QFupi900N8MGZiKkhuHeKG",
    za: "oabqLdliTwd35fNcGPgsut",
    au: "oabqLdliTwd35fNcGPgtJP",
    id: "oabqLdliTwd35fNcGPgtY7",
    mx: "oabqLdliTwd35fNcGPgtmp",
    cl: "xsFDdtCGs1CGERgpfPehEc",
  }

  const market =  process.env["SANITY_STUDIO_MARKET"]? process.env["SANITY_STUDIO_MARKET"]: "";

  // @ts-ignore
  const baseFilter = groq`_type in ${JSON.stringify(documentAssetTypes)} && count(opt.media.tags[(_ref == "${tagsRefs[market]}")]) > 0 && !(_id in path("drafts.**"))`

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

  console.log(searchQuery, "searchQuery")
  // Join separate filter fragments
  const constructedQuery = [
    // Base filter
    baseFilter,
    // Search query (if present)
    // NOTE: Currently this only searches direct fields on sanity.fileAsset/sanity.imageAsset and NOT referenced tags
    // It's possible to add this by adding the following line to the searchQuery, but it's quite slow
    // references(*[_type == "media.tag" && name.current == "${searchQuery.trim()}"]._id)
    ...(searchQuery
      ? [
          groq`[_id, altText, assetId, description, originalFilename, title, url] match '*${searchQuery.trim()}*'`
        ]
      : []),
    // Search facets
    ...searchFacetFragments
  ].join(' && ')

  return constructedQuery
}

export default constructFilter
