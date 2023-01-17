import {Box, Text, TextInput} from '@sanity/ui'
import React, {useState, useRef, memo, MouseEvent} from 'react'
import {useDispatch} from 'react-redux'
import useKeyPress from '../../hooks/useKeyPress'
import {assetsActions} from '../../modules/assets'
import type {Asset} from '../../types'

type Props = {
  asset: Asset
}

const TableRowAltEdit = (props: Props) => {
  const {asset} = props

  // Redux
  const dispatch = useDispatch()

  // Custom Alt Text editor
  const [editAltText, setEditAltText] = useState(false)
  const [newAltText, setNewAltText] = useState('')

  const altTextRef = useRef<HTMLDivElement>(null)
  const altTextInputRef = useRef<HTMLInputElement>(null)

  const handleToggleEdit = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setEditAltText(true)
    setNewAltText(asset?.altText || '')
    altTextInputRef.current?.focus()
  }

  const handleSave = () => {
    setEditAltText(false)
    // return if alt text is unchanged or empty
    console.log('atempting to save', newAltText, asset?.altText)
    if (newAltText === asset?.altText) return
    console.log('saving', newAltText)
    dispatch(assetsActions.updateRequest({asset, formData: {altText: newAltText}}))
  }

  // Cancel Alt Text edit on Escape
  useKeyPress('Escape', () => {
    console.log('escape')
    setEditAltText(false)
  })

  // Save Alt Text on Enter
  useKeyPress('Enter', () => {
    console.log('enter')
    handleSave()
    setEditAltText(false)
  })

  return (
    <>
      <Text
        hidden={editAltText}
        muted
        onClick={handleToggleEdit}
        ref={altTextRef}
        size={1}
        style={{lineHeight: '2em', cursor: 'pointer'}}
        textOverflow="ellipsis"
      >
        {asset.altText}
      </Text>

      <Text
        hidden={editAltText || asset.altText !== ''}
        muted
        onClick={handleToggleEdit}
        ref={altTextRef}
        size={1}
        style={{lineHeight: '2em', cursor: 'pointer', color: '#E84738'}}
        textOverflow="ellipsis"
      >
        No ALT text!
      </Text>

      <Box hidden={!editAltText}>
        <TextInput
          fontSize={1}
          hidden={!editAltText}
          onBlur={handleSave}
          onChange={e => setNewAltText(e.currentTarget.value)}
          onClick={e => e.stopPropagation()}
          padding={2}
          placeholder="Add ALT text"
          ref={altTextInputRef}
          style={{lineHeight: '2em'}}
          value={newAltText}
        />
      </Box>
    </>
  )
}

export default memo(TableRowAltEdit)
