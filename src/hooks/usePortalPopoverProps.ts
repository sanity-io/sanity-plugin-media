import {PopoverProps, usePortal} from '@sanity/ui'

export function usePortalPopoverProps(): PopoverProps {
  const portal = usePortal()

  return {
    constrainSize: true,
    floatingBoundary: portal.element,
    portal: true,
    referenceBoundary: portal.element
  }
}
