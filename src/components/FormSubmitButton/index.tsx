import {Box, Button, Text, Tooltip} from '@sanity/ui'
import format from 'date-fns/format'
import React, {ReactNode} from 'react'

type Props = {
  disabled: boolean
  isValid: boolean
  lastUpdated?: string
  onClick: () => void
}

const FormSubmitButton = (props: Props) => {
  const {disabled, isValid, lastUpdated, onClick} = props

  let content: ReactNode
  if (isValid) {
    if (lastUpdated) {
      content = (
        <>
          Last updated
          <br /> {format(new Date(lastUpdated), 'PPp')}
        </>
      )
    } else {
      content = 'No unpublished changes'
    }
  } else {
    content =
      'There are validation errors that need to be fixed before this document can be published'
  }

  return (
    <Tooltip
      content={
        <Box padding={3} style={{maxWidth: '185px'}}>
          <Text muted size={1}>
            {content}
          </Text>
        </Box>
      }
      disabled={'ontouchstart' in window}
      placement="top"
    >
      <Box>
        <Button
          disabled={disabled}
          fontSize={1}
          onClick={onClick}
          text="Save and close"
          tone="primary"
        />
      </Box>
    </Tooltip>
  )
}

export default FormSubmitButton
