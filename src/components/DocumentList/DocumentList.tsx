import {List, Item as ListItem} from 'part:@sanity/components/lists/default'
import {IntentLink} from 'part:@sanity/base/router'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React from 'react'

type Props = {documents: any}

const DocumentList = (props: Props) => {
  const {documents} = props
  return (
    <List>
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
          <ListItem key={doc._id}>
            <IntentLink intent="edit" params={{id: doc._id}} key={doc._id}>
              <Preview value={doc} type={schemaType} />
            </IntentLink>
          </ListItem>
        )
      })}
    </List>
  )
}

export default DocumentList
