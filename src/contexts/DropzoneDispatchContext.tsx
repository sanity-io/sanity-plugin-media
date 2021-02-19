import React, {ReactNode, createContext, useContext} from 'react'

type ContextProps = {
  open: () => void
}

type Props = {
  children: ReactNode
  open: () => void
}

const DropzoneDispatchContext = createContext<ContextProps | undefined>(undefined)

export const DropzoneDispatchProvider = (props: Props) => {
  const {children, open} = props

  const contextValue: ContextProps = {open}

  return (
    <DropzoneDispatchContext.Provider value={contextValue}>
      {children}
    </DropzoneDispatchContext.Provider>
  )
}

export const useDropzoneActions = () => {
  const context = useContext(DropzoneDispatchContext)
  if (context === undefined) {
    throw new Error('useDropzoneActions must be used within an DropzoneDispatchProvider')
  }
  return context
}

export default DropzoneDispatchContext
