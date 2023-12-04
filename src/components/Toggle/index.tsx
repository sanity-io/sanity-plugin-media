import {Card, Switch} from '@sanity/ui'
import React, {useState} from 'react'

const Togggle = (props: {
  initialState?: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}) => {
  const {initialState = false, onChange, disabled} = props

  const [selected, setSelected] = useState(initialState)

  const handleClick = () => {
    if (disabled) {
      return
    }

    setSelected(prev => !prev)
    onChange(!selected)
  }

  return (
    <Card padding={4} style={{textAlign: 'center'}}>
      <Switch checked={disabled ? false : selected} onClick={handleClick} />
    </Card>
  )
}

export default Togggle
