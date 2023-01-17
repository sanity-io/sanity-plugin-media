import {Box, Text, TextInput} from '@sanity/ui'
import React, {useState, useRef, memo, MouseEvent} from 'react'
import {useDispatch} from 'react-redux'
import useKeyPress from '../../hooks/useKeyPress'
import useClickOutside from '../../hooks/useClickOutside'
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

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAltText(e.target.value)
  }

  const handleAltClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setEditAltText(true)
    setNewAltText(asset?.altText || '')
  }

  const handleClickOutsideAltText = () => {
    setEditAltText(false)
    if (newAltText !== asset?.altText && asset?.altText !== '') {
      dispatch(assetsActions.updateRequest({asset, formData: {altText: newAltText}}))
    }
  }

  useKeyPress('Escape', () => {
    setEditAltText(false)
  })

  useClickOutside(altTextInputRef, handleClickOutsideAltText)

  return (
    <>
      <Text
        muted
        size={1}
        style={{lineHeight: '2em', cursor: 'pointer'}}
        textOverflow="ellipsis"
        onClick={handleAltClick}
        hidden={editAltText}
        ref={altTextRef}
      >
        {asset.altText}
      </Text>

      <Text
        muted
        size={1}
        style={{lineHeight: '2em', cursor: 'pointer'}}
        color="red"
        textOverflow="ellipsis"
        onClick={handleAltClick}
        hidden={editAltText && !asset.altText}
        ref={altTextRef}
      >
        No ALT text!
      </Text>

      <Box hidden={!editAltText}>
        <TextInput
          fontSize={1}
          onChange={handleAltTextChange}
          padding={2}
          style={{lineHeight: '2em'}}
          value={asset.altText}
          hidden={!editAltText}
          ref={altTextInputRef}
        />
      </Box>
    </>
  )
}

export default memo(TableRowAltEdit)
