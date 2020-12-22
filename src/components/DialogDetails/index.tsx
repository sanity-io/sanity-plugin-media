import {DownloadIcon, PublishIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Select,
  Stack,
  Tab,
  TabList,
  Text,
  TextInput
} from '@sanity/ui'
import {Item} from '@types'
import filesize from 'filesize'
import React, {FC, useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {AspectRatio} from 'theme-ui'

// import {assetsDelete} from '../../modules/assets'
import {dialogClear} from '../../modules/dialog'
import getAssetResolution from '../../util/getAssetResolution'
import imageDprUrl from '../../util/imageDprUrl'
// import DocumentList from '../DocumentList'
import Image from '../Image'

type Props = {
  item: Item
}

const Footer = () => (
  <Box padding={3}>
    <Flex justify="space-between">
      <Button fontSize={1} mode="bleed" text="Delete" tone="critical" />
      <Button fontSize={1} icon={PublishIcon} text="Update" tone="primary" />
    </Flex>
  </Box>
)

const DialogDetails: FC<Props> = (props: Props) => {
  const {item} = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleClose = useCallback(() => {
    dispatch(dialogClear())
  }, [])

  const handleDownload = () => {
    window.location.href = `${item.asset.url}?dl`
  }

  /*
  const handleDelete = useCallback(_asset => {
    dispatch(assetsDelete(_asset, 'dialog'))
  }, [])

  const dialogActions: DialogAction[] = [
    {
      callback: () => handleDelete(item.asset),
      disabled: item.updating,
      title: 'Delete',
      variant: 'danger'
    },
    {
      callback: handleClose,
      title: 'Close'
    }
  ]
  */

  const imageUrl = imageDprUrl(item?.asset, 250)

  return (
    <Dialog
      footer={<Footer />}
      header="Asset details"
      id="dialogDetails"
      onClose={handleClose}
      scheme="dark"
      width={3}
    >
      <Grid columns={[1, 1, 2]}>
        <Box padding={4}>
          {/* Image */}
          <AspectRatio ratio={item?.asset?.metadata?.dimensions?.aspectRatio}>
            <Image
              draggable={false}
              showCheckerboard={!item?.asset?.metadata?.isOpaque}
              src={imageUrl}
            />
          </AspectRatio>

          {/* Metadata */}
          <Box marginTop={3}>
            <Stack space={3}>
              {/* Size */}
              <Flex justify="space-between">
                <Text size={1}>Size</Text>
                <Text muted size={1}>
                  {filesize(item?.asset?.size, {round: 0})}
                </Text>
              </Flex>
              {/* MIME type */}
              <Flex justify="space-between">
                <Text size={1}>MIME type</Text>
                <Text muted size={1}>
                  {item?.asset?.mimeType}
                </Text>
              </Flex>
              {/* Extension */}
              <Flex justify="space-between">
                <Text size={1}>Extension</Text>
                <Text muted size={1}>
                  {(item?.asset?.extension).toUpperCase()}
                </Text>
              </Flex>
              {/* Dimensions */}
              <Flex justify="space-between">
                <Text size={1}>Dimensions</Text>
                <Text muted size={1}>
                  {getAssetResolution(item?.asset)}
                </Text>
              </Flex>
              {/* Download button */}
              <Box>
                <Button
                  fontSize={1}
                  icon={DownloadIcon}
                  mode="ghost"
                  onClick={handleDownload}
                  text="Download"
                />
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box padding={4}>
          {/* <DocumentList assetId={item.asset._id} /> */}

          {/* Tabs */}
          <TabList aria-labelledby="foo" id="oo" space={2}>
            <Tab aria-controls="bar" id="bar" label="Details" selected={true} size={2} />
            <Tab aria-controls="baz" id="baz" label="References" size={2} />
          </TabList>

          {/* <Heading size={3}>Details</Heading> */}

          {/* Form field */}
          <Box marginTop={4}>
            <Stack space={3}>
              <Box>
                <Box paddingY={2}>
                  <Text size={1}>Filename</Text>
                </Box>
                <TextInput />
              </Box>

              <Box>
                <Box paddingY={2}>
                  <Text size={1}>Label</Text>
                </Box>
                <TextInput />
              </Box>

              <Box>
                <Box paddingY={2}>
                  <Text size={1}>Title</Text>
                </Box>
                <TextInput />
              </Box>

              <Box>
                <Box paddingY={2}>
                  <Text size={1}>Description</Text>
                </Box>
                <TextInput />
              </Box>

              {/* Form field */}
              <Box>
                <Box paddingY={2}>
                  <Text size={1}>Tags</Text>
                </Box>
                <Select placeholder="tags" />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Dialog>
  )
}

export default DialogDetails
