import {Text} from '@sanity/ui'
import styled from 'styled-components'

const TextEllipsis = styled(Text)`
  line-height: 2em; // HACK
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default TextEllipsis
