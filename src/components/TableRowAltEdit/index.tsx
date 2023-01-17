import {Text, TextInput} from '@sanity/ui'
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
    setTimeout(() => {
      altTextInputRef.current?.focus()
    }, 0)
  }

  const handleSave = () => {
    setEditAltText(false)
    // return if alt text is unchanged
    if (newAltText === asset?.altText) return
    dispatch(assetsActions.updateRequest({asset, formData: {altText: newAltText}}))
  }

  // Cancel Alt Text edit on Escape
  useKeyPress('Escape', () => {
    setEditAltText(false)
  })

  // Save Alt Text on Enter
  useKeyPress('Enter', () => {
    altTextInputRef.current?.blur()
  })

  const commonTextStyles = {
    lineHeight: '2em',
    cursor: 'text',
    paddingBlock: '0.5em'
  }

  return (
    <>
      <Text
        hidden={editAltText || !asset.altText}
        muted
        onClick={handleToggleEdit}
        ref={altTextRef}
        size={1}
        style={{...commonTextStyles}}
        textOverflow="ellipsis"
      >
        {asset.altText}
      </Text>

      <Text
        hidden={editAltText || !!asset.altText}
        muted
        onClick={handleToggleEdit}
        ref={altTextRef}
        size={1}
        style={{...commonTextStyles, color: '#E84738'}}
        textOverflow="ellipsis"
      >
        Missing ALT text. Click to add.
      </Text>

      {editAltText && (
        <TextInput
          fontSize={1}
          onBlur={handleSave}
          onChange={e => setNewAltText(e.currentTarget.value)}
          onClick={e => e.stopPropagation()}
          padding={2}
          placeholder="Add ALT text"
          ref={altTextInputRef}
          style={{lineHeight: '2em'}}
          value={newAltText}
        />
      )}
    </>
  )
}

export default memo(TableRowAltEdit)
