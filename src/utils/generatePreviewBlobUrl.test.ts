import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {firstValueFrom} from 'rxjs'
import {generatePreviewBlobUrl$} from './generatePreviewBlobUrl'

describe('generatePreviewBlobUrl$', () => {
  const origCreateElement = document.createElement.bind(document)

  beforeEach(() => {
    class MockImage {
      onload: (() => void) | null = null
      width = 400
      height = 200
      set src(_v: string) {
        queueMicrotask(() => this.onload?.())
      }
    }
    vi.stubGlobal('Image', MockImage)

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        const el = origCreateElement('canvas')
        vi.spyOn(el, 'getContext').mockReturnValue({
          drawImage: vi.fn()
        } as unknown as CanvasRenderingContext2D)
        el.toBlob = cb => {
          cb?.(new Blob(['x'], {type: 'image/jpeg'}))
        }
        return el
      }
      return origCreateElement(tagName)
    })

    const createObjectURL = vi.fn(() => 'blob:mock-preview')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(URL, 'createObjectURL', {configurable: true, writable: true, value: createObjectURL})
    Object.defineProperty(URL, 'revokeObjectURL', {configurable: true, writable: true, value: revokeObjectURL})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    delete (URL as Partial<typeof URL> & {createObjectURL?: unknown}).createObjectURL
    delete (URL as Partial<typeof URL> & {revokeObjectURL?: unknown}).revokeObjectURL
  })

  it('emits a blob URL when canvas preview succeeds', async () => {
    const url = await firstValueFrom(
      generatePreviewBlobUrl$(new File(['x'], 'photo.jpg', {type: 'image/jpeg'}))
    )
    expect(url).toBe('blob:mock-preview')
  })
})
