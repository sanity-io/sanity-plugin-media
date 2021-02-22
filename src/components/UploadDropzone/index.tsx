import {white} from '@sanity/color'
import {Flex, Text} from '@sanity/ui'
import React, {FC, ReactNode} from 'react'
import {useDropzone} from 'react-dropzone'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import {useAssetSourceActions} from '../../contexts/AssetSourceDispatchContext'
import {DropzoneDispatchProvider} from '../../contexts/DropzoneDispatchContext'
import {notificationsActions} from '../../modules/notifications'
import {uploadsActions} from '../../modules/uploads'

type Props = {
  children: ReactNode
}

const UploadContainer = styled.div`
  color: white;
  height: 100%;
  min-height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;

  &:focus {
    outline: none;
  }
`

const DragActiveContainer = styled.div`
  align-items: center;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  height: 100%;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 3;
`

// Iterate through all files and only return non-folders / packages.
// We check for files by reading the first byte of the file
async function filterFiles(fileList: FileList) {
  const files = Array.from(fileList)

  const filteredFiles: File[] = []

  for (const file of files) {
    try {
      await file.slice(0, 1).arrayBuffer()
      filteredFiles.push(file)
    } catch (err) {
      // do nothing: file is a package or folder
    }
  }

  return filteredFiles
}

const UploadDropzone: FC<Props> = (props: Props) => {
  const {children} = props

  // Redux
  const dispatch = useDispatch()

  const {onSelect} = useAssetSourceActions()

  // Callbacks
  const handleDrop = async (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => dispatch(uploadsActions.uploadRequest({file})))
  }

  // Use custom file selector to filter out folders + packages
  // TODO: use correct type
  const handleFileGetter = async (event: any) => {
    let fileList: FileList | undefined = undefined

    switch (event.type) {
      case 'change':
        fileList = event.target.files
        break
      case 'drop':
        fileList = event.dataTransfer.files
        break
      default:
        return []
    }

    let files: File[] = []

    if (fileList) {
      files = await filterFiles(fileList)
    }

    // Dispatch error if some files have been filtered out
    if (fileList?.length !== files.length) {
      dispatch(
        notificationsActions.add({
          status: 'error',
          title: `Unable to upload some items (folders and packages aren't supported)`
        })
      )
    }

    return files
  }

  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    accept: onSelect ? 'image/*' : '',
    getFilesFromEvent: handleFileGetter,
    noClick: true,
    // Disable drag and drop functionality when in a selecting context
    // (This is currently due to Sanity's native image input taking precedence with drag and drop)
    noDrag: !!onSelect,
    onDrop: handleDrop
  })

  return (
    <DropzoneDispatchProvider open={open}>
      <UploadContainer {...getRootProps()}>
        <input {...getInputProps()} />

        {isDragActive && (
          <DragActiveContainer>
            <Flex direction="column" justify="center" style={{color: white.hex}}>
              <Text size={3} style={{color: 'inherit'}}>
                Drop files to upload
              </Text>
            </Flex>
          </DragActiveContainer>
        )}

        {children}
      </UploadContainer>
    </DropzoneDispatchProvider>
  )
}

export default UploadDropzone
