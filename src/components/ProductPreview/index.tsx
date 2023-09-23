import React from 'react'
import {Flex, Text, Box} from '@sanity/ui'
import {ProductDataType} from '../ProductsSelector'

const ProductPreview = (props: {value: ProductDataType}) => {
  const {value} = props
  const {imageUrl, name, inumber, published} = value

  return (
    <Flex padding={1} style={{opacity: published ? 1 : 0.5}}>
      <img
        style={{width: '60px', height: '70px'}}
        src={`${imageUrl}.JPEG?h=180&$sanity_product_thumb$`}
        alt=""
      />
      <Box padding={2}>
        <Box padding={2}>
          <Text size={2}>{name}</Text>
        </Box>
        <Box padding={2}>
          <Text size={2}>{inumber}</Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default ProductPreview
