import {ErrorOutlineIcon} from '@sanity/icons'
import {Box, Inline, Text, Tooltip} from '@sanity/ui'
import React from 'react'
import {FieldError} from 'react-hook-form'
import styled from 'styled-components'

type Props = {
  description?: string
  error?: FieldError
  label: string
  name: string
}

const StyledErrorOutlineIcon = styled(ErrorOutlineIcon)(({theme}) => {
  return {
    color: theme.sanity.color.spot.red
  }
})

const FormFieldInputLabel = (props: Props) => {
  const {description, error, label, name} = props

  return (
    <>
      {/* Label */}
      <Box marginY={3}>
        <Inline space={2}>
          <Text as="label" htmlFor={name} size={1} weight="semibold">
            {label}
          </Text>

          {/* Error icon + tooltip */}
          {error && (
            <Text size={1}>
              <Tooltip
                content={
                  <Box padding={2}>
                    <Text muted size={1}>
                      <StyledErrorOutlineIcon style={{marginRight: '0.1em'}} />
                      {error.message}
                    </Text>
                  </Box>
                }
                fallbackPlacements={['top', 'left']}
                placement="right"
                portal
              >
                <StyledErrorOutlineIcon />
              </Tooltip>
            </Text>
          )}
        </Inline>
      </Box>

      {/* Description */}
      {description && (
        <Box marginY={3}>
          <Text htmlFor={name} muted size={1}>
            {description}
          </Text>
        </Box>
      )}
    </>
  )
}

export default FormFieldInputLabel
