import {type PopoverProps, usePortal} from '@sanity/ui'

export function usePortalPopoverProps(): PopoverProps {
  const portal = usePortal()

  return {
    animate: true,
    constrainSize: true,
    floatingBoundary: portal.element,
    portal: true,
    referenceBoundary: portal.element
  }
}
