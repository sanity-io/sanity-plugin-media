import {Box} from '@sanity/ui'
import {IntentLink} from 'part:@sanity/base/router'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import {WithReferringDocuments} from 'part:@sanity/base/with-referring-documents'
import React from 'react'
// import styled from 'styled-components'
import {Box as LegacyBox} from 'theme-ui'

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
        {({isLoading, referringDocuments}: {isLoading: boolean; referringDocuments: any}) => {
          const drafts = referringDocuments.reduce(
            (acc: any, doc: any) =>
              doc._id.startsWith('drafts.') ? acc.concat(doc._id.slice(7)) : acc,
            []
          )

          const filteredDocuments = referringDocuments.filter(
            (doc: any) => !drafts.includes(doc._id)
          )

          if (isLoading) {
            return <Box>Loading...</Box>
          }

          if (filteredDocuments.length === 0) {
            return <Box>No documents are referencing this asset</Box>
          }

          console.log('> filteredDocuments', filteredDocuments)

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
              <LegacyBox key={doc._id}>
                <IntentLink intent="edit" params={{id: doc._id}} key={doc._id}>
                  <Preview layout="default" value={doc} type={schemaType} />
                </IntentLink>
              </LegacyBox>
            )
          })
        }}
      </WithReferringDocuments>
    </Box>
  )

  /*
  return (
    <LegacyBox>
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
          <LegacyBox key={doc._id}>
            <IntentLink intent="edit" params={{id: doc._id}} key={doc._id}>
              <Preview layout="default" value={doc} type={schemaType} />
            </IntentLink>
          </LegacyBox>
        )
      })}
    </LegacyBox>
  )
  */
}

export default DocumentList
