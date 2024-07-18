import {MediaToolOptions} from '@types'
import React, {PropsWithChildren, createContext, useContext, useMemo} from 'react'
import {DropzoneOptions} from 'react-dropzone'

type ContextProps = {
  dropzone: Pick<DropzoneOptions, 'maxSize'>
}

const ToolOptionsContext = createContext<ContextProps | null>(null)

type Props = {
  options?: MediaToolOptions | void
}

export const ToolOptionsProvider = ({options, children}: PropsWithChildren<Props>) => {
  const value = useMemo<ContextProps>(
    () => ({dropzone: {maxSize: options?.maximumUploadSize}}),
    [options?.maximumUploadSize]
  )

  return <ToolOptionsContext.Provider value={value}>{children}</ToolOptionsContext.Provider>
}

export const useToolOptions = () => {
  const context = useContext(ToolOptionsContext)

  if (!context) {
    throw new Error('useToolOptions must be used within an ToolOptionsProvider')
  }

  return context
}
