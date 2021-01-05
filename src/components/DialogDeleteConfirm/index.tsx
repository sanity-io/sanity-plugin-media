import {Box, Button, Dialog, Flex, Stack, Text} from '@sanity/ui'
import {Asset} from '@types'
import React, {FC, ReactNode} from 'react'
import {useDispatch} from 'react-redux'

import {dialogRemove} from '../../modules/dialog'
import useTypedSelector from '../../hooks/useTypedSelector'
import {WarningOutlineIcon} from '@sanity/icons'
import {assetsDelete, assetsDeletePicked} from '../../modules/assets'

type Props = {
  asset?: Asset
  children?: ReactNode
  closeDialogId?: string
  id: string
}

const DialogDeleteConfirm: FC<Props> = (props: Props) => {
  const {asset, children, closeDialogId, id} = props

  // Redux
  const dispatch = useDispatch()
  const byIds = useTypedSelector(state => state.assets.byIds)

  const items = Object.values(byIds)

  const picked = items?.filter(item => item?.picked)

  // Callbacks
  const handleClose = () => {
    dispatch(dialogRemove(id))
  }

  const handleDelete = () => {
    // Close target dialog, if provided
    if (closeDialogId) {
      dispatch(dialogRemove(closeDialogId))
    }

    if (asset) {
      // Delete single asset
      dispatch(assetsDelete(asset))
    } else {
      // Delete picked assets
      dispatch(assetsDeletePicked())
    }

    // Close self
    handleClose()
  }

  const suffix = picked.length > 1 ? `${picked.length} assets` : 'asset'

  const Footer = () => (
    <Box padding={3}>
      <Flex justify="space-between">
        <Button fontSize={1} mode="bleed" onClick={handleClose} text="Cancel" />
        <Button
          fontSize={1}
          onClick={handleDelete}
          text={`Yes, delete ${suffix}`}
          tone="critical"
        />
      </Flex>
    </Box>
  )

  const Header = () => (
    <Flex align="center">
      <Box paddingX={1}>
        <WarningOutlineIcon />
      </Box>
      <Box marginLeft={2}>Confirm deletion</Box>
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
      <Box paddingX={4} paddingY={4}>
        <Stack space={3}>
          <Text size={1}>Permanently delete {suffix}?</Text>
          <Text muted size={1}>
            <em>This operation cannot be reversed. Are you sure you want to continue?</em>
          </Text>
        </Stack>
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogDeleteConfirm
