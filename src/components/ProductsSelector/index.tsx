import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useDebounce} from 'usehooks-ts'
import {set, unset, ArrayOfObjectsInputProps, InputProps} from 'sanity'
import {Flex, Card, Text, Autocomplete, Box, Button} from '@sanity/ui'
import {SearchIcon, CloseIcon} from '@sanity/icons'
import {ProductProjection} from '@commercetools/platform-sdk'
// import {ByProjectKeyProductProjectionsSearchRequestBuilder} from '@commercetools/platform-sdk/dist/declarations/src/generated/client/search/by-project-key-product-projections-search-request-builder'

const AutocompleteWithPayload = Autocomplete<{
  payload: ProductProjection
  value: string
}>

export interface ProductDataType {
  _key: string
  id: string
  imageUrl: string
  name: string
  inumber: string
  published: boolean
}

const search = async (searchTerm: string) => {
  const response = await fetch(`http://localhost:4000/sanity/products?search=${searchTerm}`)
  return response.json()
}

export default function ProductSelector<T extends ProductDataType>(
  props: Partial<ArrayOfObjectsInputProps<T>>
) {
  const {value = [], onChange, renderDefault, ...rest} = props
  const [searchValue, setSearchValue] = useState<string>('')
  const [results, setResults] = useState<ProductProjection[]>([])

  const debouncedValue = useDebounce<string>(searchValue, 700)
  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 2) {
      return
    }
    ;(async () => {
      await search(debouncedValue)
      setResults([])
    })()
  }, [debouncedValue])

  const handleQueryChange = useCallback(
    (searchString: string | null) => {
      setSearchValue(searchString || '')
    },
    [setSearchValue]
  )

  const products = useMemo(
    () =>
      results.map(result => ({
        payload: result,
        value: `${result.name.en} ${debouncedValue} ${
          result.masterVariant.attributes?.find(attr => attr.name === 'iNumber')?.value || ''
        }`
      })),
    [debouncedValue, results]
  )
  const onSelect = useCallback(
    (matcher: string) => {
      const product = products.find(p => p.value === matcher)?.payload
      if (!value?.find(selectedProduct => selectedProduct.id === product?.id)) {
        const images = product?.masterVariant?.images
        const imageUrl =
          images?.find(image => /STN-01$/.test(image.url))?.url ||
          images?.find(image => /ST-01$/.test(image.url))?.url ||
          images?.[0]?.url
        onChange?.(
          set([
            ...value,
            {
              id: product?.id,
              imageUrl,
              name: product?.name.en || '',
              published: !!product?.published,
              inumber:
                product?.masterVariant.attributes?.find(attr => attr.name === 'iNumber')?.value ||
                '',
              _key: product?.key || product?.id || ''
            }
          ])
        )
      }
    },
    [products, onChange, value]
  )

  const dafault = useMemo(
    () =>
      renderDefault?.({
        ...rest,
        readOnly: true
      } as unknown as InputProps),
    [renderDefault, rest]
  )

  return (
    <Card border padding={3}>
      <AutocompleteWithPayload
        fontSize={[2, 2, 3]}
        id="product-selector"
        icon={SearchIcon}
        onQueryChange={handleQueryChange}
        onSelect={onSelect}
        options={products}
        padding={[3, 3, 4]}
        placeholder="Type to find product …"
        renderOption={option => (
          <Card as="button" border style={{opacity: option.payload.published ? 1 : 0.5}}>
            <Flex align="center">
              <Box paddingLeft={3} paddingY={2} style={{height: '65px'}}>
                <img
                  style={{width: '60px', height: '70px'}}
                  src={`${
                    option.payload.masterVariant.images?.find(image => /STN-01$/.test(image.url))
                      ?.url ||
                    option.payload.masterVariant.images?.find(image => /ST-01$/.test(image.url))
                      ?.url ||
                    option.payload.masterVariant.images?.[0]?.url
                  }.JPEG?h=180&$sanity_product_thumb$`}
                  alt={'img'}
                />
              </Box>
              <Box padding={2}>
                <Box padding={2}>
                  <Text size={[2, 2, 3]}>{option.payload.name.en}</Text>
                </Box>
                <Box padding={2}>
                  <Text size={[2, 2, 3]}>
                    {option.payload.masterVariant.attributes?.find(attr => attr.name === 'iNumber')
                      ?.value || ''}
                  </Text>
                </Box>
              </Box>
            </Flex>
          </Card>
        )}
        renderValue={() => {
          return ''
        }}
      />
      <Box paddingTop={3}>
        <Button
          disabled={!value?.length}
          fontSize={[1, 1, 1]}
          icon={CloseIcon}
          onClick={() => onChange?.(unset())}
          tone="critical"
          mode="ghost"
          padding={[3, 3, 4]}
          text="Clear all"
        />
      </Box>
      <Box flex={1} paddingY={3}>
        {dafault}
      </Box>
    </Card>
  )
}
