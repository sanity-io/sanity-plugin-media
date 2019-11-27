import {useNProgress} from '@tanem/react-nprogress'
import React from 'react'

import Box from '../../styled/Box'

type Props = {
  loading?: boolean
}

const Progress = (props: Props) => {
  const {loading} = props

  const {animationDuration, isFinished, progress} = useNProgress({
    animationDuration: 300,
    isAnimating: loading
  })

  return (
    <Box opacity={isFinished ? 0 : 1} transition={`opacity ${animationDuration}ms linear`}>
      <Box
        bg="gray"
        height="1px"
        position="absolute"
        top={0}
        transition={`width ${animationDuration}ms linear`}
        width={`${progress * 100}%`}
      />
    </Box>
  )
}

export default Progress
