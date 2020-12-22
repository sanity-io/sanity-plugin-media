import {Box, Button, Dialog, Flex, Text} from '@sanity/ui'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import {dialogClear} from '../../modules/dialog'
import useTypedSelector from '../../hooks/useTypedSelector'
import {WarningOutlineIcon} from '@sanity/icons'
import {assetsDeletePicked} from '../../modules/assets'

const DialogDeletePickedConfirm: FC = () => {
  // Redux
  const dispatch = useDispatch()
  // TODO: DRY
  const byIds = useTypedSelector(state => state.assets.byIds)

  const items = byIds ? Object.values(byIds) : []

  const picked = items && items.filter(item => item.picked)

  // Callbacks
  const handleClose = () => {
    dispatch(dialogClear())
  }

  const handleDeletePicked = () => {
    dispatch(assetsDeletePicked())
    dispatch(dialogClear())
  }

  const suffix = picked.length > 1 ? `${picked.length} assets` : 'asset'

  const Footer = () => (
    <Box padding={3}>
      <Flex justify="space-between">
        <Button fontSize={1} mode="bleed" onClick={handleClose} text="Cancel" />
        <Button
          fontSize={1}
          onClick={handleDeletePicked}
          text={`Yes, delete ${suffix}`}
          tone="critical"
        />
      </Flex>
    </Box>
  )

  const Header = () => (
    <Flex align="center">
      <WarningOutlineIcon />
      <Box marginLeft={3}>Permanently delete {suffix}?</Box>
    </Flex>
  )

  return (
    <Dialog
      footer={<Footer />}
      header={<Header />}
      id="deleteConfirm"
      onClose={handleClose}
      scheme="dark"
      width={1}
    >
      <Box padding={4}>
        <Text muted size={1}>
          This operation cannot be reversed. Are you sure you want to continue?
        </Text>
      </Box>
    </Dialog>
  )
}

export default DialogDeletePickedConfirm
