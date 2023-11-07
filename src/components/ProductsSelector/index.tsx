/* eslint-disable no-console */
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useDebounce} from 'usehooks-ts'
import {Flex, Card, Text, Autocomplete, Box, Button} from '@sanity/ui'
import {SearchIcon, CloseIcon} from '@sanity/icons'
import {ProductProjection} from '@commercetools/platform-sdk'
import ProductPreview from '../ProductPreview'
import FormFieldInputLabel from '../FormFieldInputLabel'

const AutocompleteWithPayload = Autocomplete<{
  payload: ProductProjection
  value: string
}>

export interface ProductDataType {
  _key: string
  id: string
  imageUrl: string
  name: string
  published: boolean
}

const search = async (searchTerm: string) => {
  // eslint-disable-next-line no-undef, no-process-env
  const baseUrl = process?.env?.SANITY_STUDIO_PROVIDER_BASEURL
  const urlToUse = baseUrl
    ? `${baseUrl}/sanity/products?search=${searchTerm}`
    : `https://sanity-ct-products-provider.fly.dev/sanity/products?search=${searchTerm}`
  const response = await fetch(urlToUse)
  return response.json()
}

export default function ProductSelector(props: {
  value: ProductDataType[]
  onChange?: (updatedValue: ProductDataType[]) => void
  error?: string
  label: string
  labelDescription: string
  name: string
}) {
  const {value = [], onChange, error, label, labelDescription, name} = props
  const [searchValue, setSearchValue] = useState<string>('')
  const [results, setResults] = useState<ProductProjection[]>([])
  const [localValue, setLocalValue] = useState<ProductDataType[]>(value)

  const debouncedValue = useDebounce<string>(searchValue, 700)
  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 2) {
      return
    }
    ;(async () => {
      const searchResults = await search(debouncedValue)
      const {
        data: {published, unpublished}
      } = searchResults
      setResults([...published, unpublished])
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
        value: `${result?.name?.en} ${debouncedValue} ${
          result?.masterVariant?.attributes?.find(attr => attr?.name === 'iNumber')?.value || ''
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
        const productToAdd = {
          id: product?.id!,
          imageUrl: imageUrl!,
          name: product?.name.en || '',
          published: !!product?.published,
          _key: product?.key || ''
        }
        const updatedValue = [...localValue, productToAdd]
        setLocalValue(updatedValue)
        onChange?.(updatedValue)
        setSearchValue('')
      }
    },
    [products, value, localValue, onChange]
  )

  const handleDelete = useCallback(
    (id: string) => {
      const updatedValue = localValue.filter(product => product.id !== id)
      setLocalValue(updatedValue)
      onChange?.(updatedValue)
    },
    [localValue, onChange]
  )

  const handleClearAll = useCallback(() => {
    setLocalValue([])
    onChange?.([])
  }, [onChange])

  return (
    <Card border padding={3}>
      <FormFieldInputLabel error={error} description={labelDescription} label={label} name={name} />
      <Card marginY={2}>
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
            <Card as="button" border style={{opacity: option?.payload?.published ? 1 : 0.5}}>
              <Flex align="center">
                <Box paddingLeft={3} paddingY={2} style={{height: '65px'}}>
                  <img
                    style={{width: '60px', height: '70px'}}
                    src={`${
                      option?.payload?.masterVariant?.images?.find(image =>
                        /STN-01$/.test(image?.url)
                      )?.url ||
                      option?.payload?.masterVariant?.images?.find(image =>
                        /ST-01$/.test(image?.url)
                      )?.url ||
                      option?.payload?.masterVariant?.images?.[0]?.url
                    }.JPEG?h=180&$sanity_product_thumb$`}
                    alt={'img'}
                  />
                </Box>
                <Box padding={2}>
                  <Box padding={2}>
                    <Text size={[2, 2, 3]}>{option?.payload?.name?.en}</Text>
                  </Box>
                  <Box padding={2}>
                    <Text size={[2, 2, 3]}>{option?.payload?.masterVariant?.id}</Text>
                  </Box>
                </Box>
              </Flex>
            </Card>
          )}
        />
      </Card>

      <Box paddingTop={3} marginBottom={3}>
        {localValue.length > 0 && (
          <Button
            disabled={!value?.length}
            icon={CloseIcon}
            onClick={handleClearAll}
            tone="critical"
            mode="ghost"
            padding={[2, 2, 3]}
            text="Clear all"
          />
        )}
        {localValue?.map(product => (
          <Card marginY={2} key={product._key}>
            <ProductPreview onDelete={handleDelete} value={product} />
          </Card>
        ))}
      </Box>
    </Card>
  )
}
