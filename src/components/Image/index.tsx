import {hues} from '@sanity/color'
import {MouseEvent} from 'react'
import styled, {css} from 'styled-components'

type Props = {
  onClick?: (e: MouseEvent) => void
  showCheckerboard?: boolean
  src: string
  style?: any
}

const Image = styled.img<Props>`
  --checkerboard-color: ${hues.gray[900].hex};

  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;

  ${props =>
    props.showCheckerboard &&
    css`
      background-image: linear-gradient(45deg, var(--checkerboard-color) 25%, transparent 25%),
        linear-gradient(-45deg, var(--checkerboard-color) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--checkerboard-color) 75%),
        linear-gradient(-45deg, transparent 75%, var(--checkerboard-color) 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0;
    `}
`

export default Image
