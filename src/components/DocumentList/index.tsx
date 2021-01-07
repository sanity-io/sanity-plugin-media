import {SanityDocument} from '@sanity/client'
import {Box, Card, Text} from '@sanity/ui'
import {IntentLink} from 'part:@sanity/base/router'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import {WithReferringDocuments} from 'part:@sanity/base/with-referring-documents'
import React from 'react'
import styled from 'styled-components'

type Props = {
  assetId: string
}

// Brute force styles on all of Sanity's preview components.
// TODO: Consider using a custom preview component that is able to resolve custom titles
// (and potentially subtitles) defined at the document schema level. Or anything to ensure
// that future upstream changes to Sanity's preview components don't break anything here.
const Container = styled(Box)`
  * {
    color: ${props => props.theme.sanity.color.base.fg};
  }

  a {
    text-decoration: none;
  }

  h2 {
    font-size: ${props => props.theme.sanity.fonts.text.sizes[1]};
  }
`

const DocumentList = (props: Props) => {
  const {assetId} = props

  return (
    <Container>
      <WithReferringDocuments id={assetId}>
        {({
          isLoading,
          referringDocuments
        }: {
          isLoading: boolean
          referringDocuments: SanityDocument
        }) => {
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

          return filteredDocuments?.map(doc => {
            const schemaType = schema.get(doc._type)
            if (!schemaType) {
              return (
                <div>
                  A document of the unknown type <em>{doc._type}</em>
                </div>
              )
            }

            return (
              <Card
                key={doc._id}
                marginBottom={2}
                padding={2}
                radius={2}
                scheme="dark"
                shadow={1}
                style={{
                  overflow: 'hidden'
                }}
              >
                <Box>
                  <IntentLink intent="edit" params={{id: doc._id}} key={doc._id}>
                    <Preview layout="default" value={doc} type={schemaType} />
                  </IntentLink>
                </Box>
              </Card>
            )
          })
        }}
      </WithReferringDocuments>
    </Container>
  )
}

export default DocumentList
