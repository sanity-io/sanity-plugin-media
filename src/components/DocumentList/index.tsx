import {SanityDocument} from '@sanity/client'
import {Box} from '@sanity/ui'
import {IntentLink} from 'part:@sanity/base/router'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import {WithReferringDocuments} from 'part:@sanity/base/with-referring-documents'
import React from 'react'

type Props = {
  assetId: string
}

// Brute force styles on all of Sanity's preview components.

/*
// TODO: Consider using a custom preview component that is able to resolve custom titles
// (and potentially subtitles) defined at the document schema level. Or anything to ensure
// that future upstream changes to Sanity's preview components don't break anything here.
const Container = styled(Box)`
  * {
    color: ${props => props.theme.colors.lighterGray};
    font-size: ${props => props.theme.fontSizes?.[1]};
  }
`
*/

const DocumentList = (props: Props) => {
  const {assetId} = props

  return (
    <Box>
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
            return <Box>Loading...</Box>
          }

          if (filteredDocuments.length === 0) {
            return <Box>No documents are referencing this asset</Box>
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
              <Box key={doc._id}>
                <IntentLink intent="edit" params={{id: doc._id}} key={doc._id}>
                  <Preview layout="default" value={doc} type={schemaType} />
                </IntentLink>
              </Box>
            )
          })
        }}
      </WithReferringDocuments>
    </Box>
  )
}

export default DocumentList
