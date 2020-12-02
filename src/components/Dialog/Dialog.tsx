import {useClickOutside} from '@sanity/ui'
import {WithReferringDocuments} from 'part:@sanity/base/with-referring-documents'
import React, {ReactNode, useState} from 'react'
import {IoIosAlert, IoIosClose} from 'react-icons/io'

import {Asset, DialogAction} from '../../types'
import Box from '../../styled/Box'
import Image from '../../styled/Image'
import imageDprUrl from '../../util/imageDprUrl'
import Button from '../Button/Button'
import ResponsiveBox from '../ResponsiveBox/ResponsiveBox'

type Variant = 'default' | 'danger'

type Props = {
  actions: DialogAction[]
  asset: Asset
  children: (filteredDocuments: any) => ReactNode
  onClose: () => void
  title: string
  variant?: Variant
}

const Dialog = (props: Props) => {
  const {actions, asset, children, onClose, title, variant = 'default'} = props

  const imageUrl = imageDprUrl(asset, 250)
  const isDanger = variant === 'danger'

  // State
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(null)

  // Close when clicked outside dialog container
  useClickOutside(() => {
    onClose()
  }, [containerElement])

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxHeight="calc(100% - 100px)"
      maxWidth="560px"
      overflow="hidden"
      ref={setContainerElement}
      width="100%"
    >
      {/* Header */}
      <Box
        alignItems="center"
        bg="darkestGray"
        fontSize={1}
        display="flex"
        height="headerRowHeight"
        justifyContent="space-between"
        pl={3}
        textColor="lighterGray"
      >
        {/* Title */}
        <Box alignItems="center" display="flex" textColor={isDanger ? 'red' : 'inherit'}>
          {isDanger && (
            <Box mr={1}>
              <IoIosAlert size={18} style={{display: 'block'}} />
            </Box>
          )}
          <strong>{title}</strong>
        </Box>

        {/* Close */}
        <Button icon={IoIosClose({size: 25})} onClick={onClose} />
      </Box>

      <Box
        // alignItems="center"
        bg="darkestGray"
        className="custom-scrollbar"
        display="grid"
        // gridGap="1rem"
        gridTemplateColumns={['none', 'max-content 1fr']}
        justifyItems={['center', 'flex-start']}
        overflowY="auto"
        textColor="lightGray"
      >
        {/* Image */}
        <Box width="200px">
          <ResponsiveBox aspectRatio={asset?.metadata?.dimensions?.aspectRatio}>
            <Image draggable={false} showCheckerboard={!asset?.metadata?.isOpaque} src={imageUrl} />
          </ResponsiveBox>
        </Box>

        {/* Content */}
        <Box fontSize={1} overflow="hidden" position="relative" px={3} py={[3, 2]} width="100%">
          <WithReferringDocuments id={asset._id}>
            {({isLoading, referringDocuments}: {isLoading: boolean; referringDocuments: any}) => {
              const drafts = referringDocuments.reduce(
                (acc: any, doc: any) =>
                  doc._id.startsWith('drafts.') ? acc.concat(doc._id.slice(7)) : acc,
                []
              )

              const filteredDocuments = referringDocuments.filter(
                (doc: any) => !drafts.includes(doc._id)
              )

              if (isLoading) {
                return <Box>Loading...</Box>
              }

              if (filteredDocuments.length === 0) {
                return <Box>No documents are referencing this asset</Box>
              }

              return <div>{children(filteredDocuments)}</div>
            }}
          </WithReferringDocuments>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        alignItems="center"
        bg="darkestGray"
        display="flex"
        height="headerRowHeight"
        justifyContent="space-between"
      >
        {actions.map((action, index) => {
          return (
            <Button
              icon={action?.icon}
              key={index}
              onClick={action?.callback}
              variant={action.variant}
            >
              {action.title}
            </Button>
          )
        })}
      </Box>
    </Box>
  )
}

export default Dialog
