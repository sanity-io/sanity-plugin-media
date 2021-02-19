import {white} from '@sanity/color'
import {Flex, Text} from '@sanity/ui'
import React, {FC, ReactNode} from 'react'
import {useDropzone} from 'react-dropzone'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import {DropzoneDispatchProvider} from '../../contexts/DropzoneDispatchContext'
import {uploadsActions} from '../../modules/uploads'

type Props = {
  children: ReactNode
}

const UploadContainer = styled.div`
  background: red;
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
  z-index: 2;
`

/*
const uploadFile = (file: File) => {

}
*/

/*
  - Create observable which listens to all uploads
  - On new upload, push to this observable
*/

const UploadDropzone: FC<Props> = (props: Props) => {
  const {children} = props

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleDrop = async (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => dispatch(uploadsActions.uploadRequest({file})))
  }

  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    noClick: true,
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
