import type {SanityDocument} from '@sanity/client'
import {Box, Button, Card, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Preview, SchemaType, useDocumentStore, useSchema, WithReferringDocuments} from 'sanity'
import {useIntentLink} from 'sanity/router'

type Props = {
  assetId: string
}

const DocumentList = (props: Props) => {
  const {assetId} = props

  const documentStore = useDocumentStore()

  return (
    <WithReferringDocuments documentStore={documentStore} id={assetId}>
      {({isLoading, referringDocuments}) => (
        <ReferringDocuments isLoading={isLoading} referringDocuments={referringDocuments} />
      )}
    </WithReferringDocuments>
  )
}

const ReferringDocuments = (props: {isLoading: boolean; referringDocuments: SanityDocument[]}) => {
  const {isLoading, referringDocuments} = props

  const schema = useSchema()

  const draftIds = referringDocuments.reduce(
    (acc: string[], doc: SanityDocument) =>
      doc._id.startsWith('drafts.') ? acc.concat(doc._id.slice(7)) : acc,
    []
  )

  const filteredDocuments: SanityDocument[] = referringDocuments.filter(
    (doc: SanityDocument) => !draftIds.includes(doc._id)
  )

  if (isLoading) {
    return <Text size={1}>Loading...</Text>
  }

  if (filteredDocuments.length === 0) {
    return <Text size={1}>No documents are referencing this asset</Text>
  }

  return (
    <Card flex={1} marginBottom={2} padding={2} radius={2} shadow={1}>
      <Stack space={2}>
        {filteredDocuments?.map(doc => (
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
