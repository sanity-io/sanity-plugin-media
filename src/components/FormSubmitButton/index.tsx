import {Box, Button, Text, Tooltip} from '@sanity/ui'
import format from 'date-fns/format'
import React, {FC} from 'react'

type Props = {
  disabled: boolean
  isValid: boolean
  lastUpdated?: string
  onClick: () => void
}

const FormSubmitButton: FC<Props> = (props: Props) => {
  const {disabled, isValid, lastUpdated, onClick} = props

  return (
    <Tooltip
      content={
        <Box padding={3} style={{maxWidth: '185px'}}>
          <Text muted size={1}>
            {isValid ? (
              lastUpdated ? (
                <>
                  Last updated
                  <br /> {format(new Date(lastUpdated), 'PPp')}
                </>
              ) : (
                'No unpublished changes'
              )
            ) : (
              'There are validation errors that need to be fixed before this document can be published'
            )}
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
