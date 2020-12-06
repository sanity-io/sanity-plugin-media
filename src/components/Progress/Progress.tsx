import {useNProgress} from '@tanem/react-nprogress'
import React from 'react'
import {Box} from 'theme-ui'

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
    <Box
      sx={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`
      }}
    >
      <Box
        sx={{
          height: '1px',
          position: 'absolute',
          left: 0,
          top: 0,
          transition: `width ${animationDuration}ms linear`,
          width: `${progress * 100}%`
        }}
      />
    </Box>
  )
}

export default Progress
