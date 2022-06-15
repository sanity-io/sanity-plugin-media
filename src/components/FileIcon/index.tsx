import {Box, Flex} from '@sanity/ui'
import React, {MouseEvent} from 'react'
import {defaultStyles, FileIcon as ReactFileIcon} from 'react-file-icon'
import type {DefaultExtensionType} from 'react-file-icon'
import styled from 'styled-components'

type Props = {
  extension?: string
  onClick?: (e: MouseEvent) => void
  width: string
}

// Force react-file-icon styles
const Container = styled(Box)`
  text {
    font-family: ${props => props.theme.sanity.fonts.text.family} !important;
    font-size: 8px !important;
    font-weight: 500 !important;
  }
`

const FileIcon = (props: Props) => {
  const {extension, onClick, width} = props

  return (
    <Flex align="center" justify="center" onClick={onClick} style={{height: '100%'}}>
      <Container style={{width}}>
        {extension ? (
          <ReactFileIcon
            extension={extension}
            {...defaultStyles[extension as DefaultExtensionType]}
          />
        ) : (
          <ReactFileIcon />
        )}
      </Container>
    </Flex>
  )
}

export default FileIcon
