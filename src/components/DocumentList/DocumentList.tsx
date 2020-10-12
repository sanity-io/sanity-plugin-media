import {IntentLink} from 'part:@sanity/base/router'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React from 'react'

import Box from '../../styled/Box'

type Props = {documents: any}

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
          <Box key={doc._id}>
            <IntentLink intent="edit" params={{id: doc._id}} key={doc._id}>
              <Preview value={doc} type={schemaType} />
            </IntentLink>
          </Box>
        )
      })}
    </Box>
  )
}

export default DocumentList
