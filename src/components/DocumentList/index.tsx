import type {SanityDocument} from '@sanity/client'
import {Box, Button, Card, Stack, Text} from '@sanity/ui'

import {Preview, type SchemaType, useSchema} from 'sanity'
import {useIntentLink} from 'sanity/router'

type Props = {
  documents: SanityDocument[]
  isLoading: boolean
}

const DocumentList = ({documents, isLoading}: Props) => {
  const schema = useSchema()

  if (isLoading) {
    return (
      <Text muted size={1}>
        Loading...
      </Text>
    )
  }

  if (documents.length === 0) {
    return (
      <Text muted size={1}>
        No documents are referencing this asset
      </Text>
    )
  }

  return (
    <Card flex={1} marginBottom={2} padding={2} radius={2} shadow={1}>
      <Stack space={2}>
        {documents?.map(doc => (
          <ReferringDocument doc={doc} key={doc._id} schemaType={schema.get(doc._type)} />
        ))}
      </Stack>
    </Card>
  )
}

const ReferringDocument = (props: {doc: SanityDocument; schemaType?: SchemaType}) => {
  const {doc, schemaType} = props

  const {onClick} = useIntentLink({
    intent: 'edit',
    params: {id: doc._id}
  })

  return schemaType ? (
    <Button key={doc._id} mode="bleed" onClick={onClick} padding={2} style={{width: '100%'}}>
      <Preview layout="default" schemaType={schemaType} value={doc} />
    </Button>
  ) : (
    <Box padding={2}>
      <Text size={1}>
        A document of the unknown type <em>{doc._type}</em>
      </Text>
    </Box>
  )
}

export default DocumentList
