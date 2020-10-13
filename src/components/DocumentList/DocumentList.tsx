import {IntentLink} from 'part:@sanity/base/router'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React from 'react'
import styled from 'styled-components'

import Box from '../../styled/Box'

type Props = {documents: any}

// Brute force styles on all of Sanity's preview components.

// TODO: Consider using a custom preview component that is able to resolve custom titles
// (and potentially subtitles) defined at the document schema level. Or anything to ensure
// that future upstream changes to Sanity's preview components don't break anything here.
const Container = styled(Box)`
  * {
    color: ${props => props.theme.colors.lighterGray};
    font-size: ${props => props.theme.fontSizes?.[1]};
  }
`

const DocumentList = (props: Props) => {
  const {documents} = props
  return (
    <Box>
      {documents.map((doc: any) => {
        const schemaType = schema.get(doc._type)
        if (!schemaType) {
          return (
            <div>
              A document of the unknown type <em>{doc._type}</em>
            </div>
          )
        }

        return (
          <Container key={doc._id} mb={1}>
            <IntentLink intent="edit" params={{id: doc._id}} key={doc._id}>
              <Preview layout="default" value={doc} type={schemaType} />
            </IntentLink>
          </Container>
        )
      })}
    </Box>
  )
}

export default DocumentList
