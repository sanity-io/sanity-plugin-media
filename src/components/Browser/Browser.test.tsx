import {describe, expect, it, vi, beforeEach} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import {studioTheme, ThemeProvider, ToastProvider} from '@sanity/ui'
import {ColorSchemeProvider} from 'sanity'
import {of} from 'rxjs'
import Browser from './index'
import {createListenMock} from '../../__tests__/fixtures/listenMock'
import {createMockSanityClient} from '../../__tests__/fixtures/mockSanityClient'
import {ToolOptionsProvider} from '../../contexts/ToolOptionsContext'
import useVersionedClient from '../../hooks/useVersionedClient'

vi.mock('../../hooks/useVersionedClient', () => ({
  default: vi.fn()
}))

describe('Browser', () => {
  beforeEach(() => {
    const fetch = vi.fn().mockReturnValue(of({items: []}))
    vi.mocked(useVersionedClient).mockReturnValue(
      createMockSanityClient({
        listen: createListenMock(),
        observable: {fetch}
      })
    )
  })

  it('renders Browse Assets header in tool mode', async () => {
    render(
      <ColorSchemeProvider scheme="light">
        <ThemeProvider theme={studioTheme}>
          <ToastProvider>
            <ToolOptionsProvider options={{creditLine: {enabled: false}}}>
              <Browser />
            </ToolOptionsProvider>
          </ToastProvider>
        </ThemeProvider>
      </ColorSchemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Browse Assets')).toBeInTheDocument()
    })
  })
})
