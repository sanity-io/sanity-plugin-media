import React, {useCallback} from 'react'
import {ObjectItemProps, ObjectItem} from 'sanity'
import {Flex, Text, Box} from '@sanity/ui'
import {ProductDataType} from '../ProductsSelector'

const ProductItem = (props: ObjectItemProps<ObjectItem>) => {
  const {value} = props
  const {imageUrl, name, inumber, published} = value as ProductDataType

  const PrevievComp = useCallback(() => {
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
  }, [imageUrl, name, inumber, published])

  return props.renderDefault({
    ...props,
    open: false,
    schemaType: {
      ...props.schemaType,
      components: {
        ...props.schemaType.components,
        preview: PrevievComp
      },
      preview: {
        ...props.schemaType.preview,
        select: {title: 'name', media: 'imageUrl'}
      }
    }
  })
}

export default ProductItem
