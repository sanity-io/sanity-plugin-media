import React from 'react'
import styled from 'styled-components'
import Box from '../../styled/Box'

type Props = {
  aspectRatio: number
  children: React.ReactNode
}

const Container = styled(Box)<Props>`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: ${props => `${100 / props.aspectRatio}%`};
`

const Content = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`

const ResponsiveBox = (props: Props) => {
  const {children} = props

  return (
    <Container {...props}>
      <Content>{children}</Content>
    </Container>
  )
}

export default ResponsiveBox
