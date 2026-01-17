import type {MediaToolOptions, Locale} from '../types'
import {type PropsWithChildren, createContext, useContext, useMemo} from 'react'
import type {DropzoneOptions} from 'react-dropzone'

type ContextProps = {
  dropzone: Pick<DropzoneOptions, 'maxSize'>
  components: MediaToolOptions['components']
  creditLine: MediaToolOptions['creditLine']
  directUploads: MediaToolOptions['directUploads']
  locales?: Locale[]
}

const ToolOptionsContext = createContext<ContextProps | null>(null)

type Props = {
  options?: MediaToolOptions | void
}

export const ToolOptionsProvider = ({options, children}: PropsWithChildren<Props>) => {
  const value = useMemo<ContextProps>(() => {
    let creditLineExcludeSources

    if (options?.creditLine?.excludeSources) {
      creditLineExcludeSources = Array.isArray(options?.creditLine?.excludeSources)
        ? options.creditLine.excludeSources
        : [options?.creditLine?.excludeSources]
    }

    return {
      dropzone: {maxSize: options?.maximumUploadSize},
      components: {
        details: options?.components?.details
      },
      creditLine: {
        enabled: options?.creditLine?.enabled || false,
        excludeSources: creditLineExcludeSources
      },
      directUploads: options?.directUploads ?? true,
      locales: options?.locales
    }
  }, [
    options?.creditLine?.enabled,
    options?.components,
    options?.creditLine?.excludeSources,
    options?.maximumUploadSize,
    options?.directUploads
  ])

  return <ToolOptionsContext.Provider value={value}>{children}</ToolOptionsContext.Provider>
}

export const useToolOptions = () => {
  const context = useContext(ToolOptionsContext)

  if (!context) {
    throw new Error('useToolOptions must be used within an ToolOptionsProvider')
  }

  return context
}
