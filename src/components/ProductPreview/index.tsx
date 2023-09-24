import React from 'react'
import {Flex, Text, Box, Button} from '@sanity/ui'
import {TrashIcon} from '@sanity/icons'
import {ProductDataType} from '../ProductsSelector'

const ProductPreview = (props: {value: ProductDataType; onDelete: (id: string) => void}) => {
  // eslint-disable-next-line no-empty-function
  const {value, onDelete = () => {}} = props
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
      <Box padding={2}>
        <Button
          fontSize={[2, 2, 3]}
          icon={TrashIcon}
          onClick={() => onDelete(value.id)}
          padding={[3, 3, 4]}
          text="Remove"
          tone="critical"
        />
      </Box>
    </Flex>
  )
}

export default ProductPreview
