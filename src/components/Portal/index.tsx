import React from 'react'
import {createPortal} from 'react-dom'

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

type Props = {
  children: React.ReactNode
}

class Portal extends React.Component<Props> {
  node!: HTMLDivElement | null

  componentWillUnmount() {
    if (this.node) {
      document.body.removeChild(this.node)
    }
    this.node = null
  }

  render() {
    if (!canUseDOM) {
      return null
    }
    if (!this.node) {
      this.node = document.createElement('div')
      document.body.appendChild(this.node)
    }
    return createPortal(
      <React.Fragment>
        {this.props.children}
        {/*
          the following element is needed to prevent tab key from navigating out of window context. Since the
          portal content is appended to the DOM, hitting the tab key while having focus on on the last element
          will navigate *out* of the document, causing focus to move to a browser UI control.
        */}
        <span tabIndex={0} />
      </React.Fragment>,
      this.node
    )
  }
}

export default Portal
