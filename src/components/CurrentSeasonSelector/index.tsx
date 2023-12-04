import {Card} from '@sanity/ui'
import React from 'react'
import FormFieldInputLabel from '../FormFieldInputLabel'
import Togggle from '../Toggle'

type Props = {
  isCurrentSeason?: boolean
  onChange: (value: boolean) => void

  description?: string
  disabled?: boolean
  error?: string
  label: string
  name: string
}

const CurrentSeasonToggle = (props: Props) => {
  const {description, disabled, label, name, error, isCurrentSeason, onChange} = props

  return (
    <Card padding={4} style={{textAlign: 'center'}}>
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      <Togggle
        initialState={isCurrentSeason}
        disabled={disabled}
        onChange={value => onChange(value)}
      />
    </Card>
  )
}

export default CurrentSeasonToggle
