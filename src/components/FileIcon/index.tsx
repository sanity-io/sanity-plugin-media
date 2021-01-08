import {Box, Flex} from '@sanity/ui'
import {Asset} from '@types'
import {FileIcon as ReactFileIcon, defaultStyles} from 'react-file-icon'
import React, {FC, MouseEvent} from 'react'
import styled from 'styled-components'

type Props = {
  asset: Asset
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

const FileIcon: FC<Props> = (props: Props) => {
  const {asset, onClick, width} = props

  return (
    <Flex align="center" justify="center" onClick={onClick} style={{height: '100%'}}>
      <Container style={{width}}>
        <ReactFileIcon extension={asset.extension} {...defaultStyles[asset.extension]} />
      </Container>
    </Flex>
  )
}

export default FileIcon
