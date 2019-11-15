import styled from 'styled-components'
import css from '@styled-system/css'
import Box from './Box'

const Row = styled(Box)`
  display: grid;
  position: relative;

  ${css({
    alignItems: 'center',
    gridTemplateColumns: ['1rem 8rem auto', '3rem 6.5rem auto 7rem 4rem 4.5rem 9rem 2rem 10rem'],
    gridTemplateRows: ['auto', '1fr'],
    p: [2, 0]
  })}

  > ${Box} {
    overflow: hidden;
    text-overflow: ellipsis;
    ${css({
      p: [0, 2]
    })}

    /* Checkbox */
    &:nth-child(1) {
      grid-row-start: 1;
      grid-row-end: span 1000;
    }

    /* Preview */
    &:nth-child(2) {
      grid-row-start: 1;
      grid-row-end: span 1000;

      ${css({
        mx: [2, 0]
      })}
    }

    /* Filename */
    &:nth-child(3) {
    }

    /* Dimensions */
    &:nth-child(4) {
    }

    /* Updated at */
    &:nth-child(7) {
    }

    /* Error */
    &:nth-child(8) {
      ${css({
        py: [1, 0]
      })}
    }

    /* Actions */
    &:nth-child(9) {
    }
  }
`

export default Row
