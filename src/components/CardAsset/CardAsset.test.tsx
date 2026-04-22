import type {RefObject} from 'react'
import userEvent from '@testing-library/user-event'
import {screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import CardAsset from './index'
import {renderWithProviders} from '../../__tests__/fixtures/renderWithProviders'
import {initialState as assetsInitialState} from '../../modules/assets'
import type {AssetItem, AssetType, FileAsset, ImageAsset} from '../../types'

const SHIFT_FLAG = '__CARD_ASSET_TEST_SHIFT__'

function setShiftPressed(on: boolean) {
  const g = globalThis as unknown as Record<string, boolean | undefined>
  if (on) {
    g[SHIFT_FLAG] = true
  } else {
    delete g[SHIFT_FLAG]
  }
}

vi.mock('../../hooks/useKeyPress', () => ({
  default: (): RefObject<boolean> =>
    ({
      get current() {
        return Boolean((globalThis as unknown as Record<string, unknown>)[SHIFT_FLAG])
      }
    } as RefObject<boolean>)
}))

vi.mock('../Image', () => ({
  default: () => <div data-testid="card-image" />
}))

vi.mock('../FileIcon', () => ({
  default: ({extension}: {extension?: string}) => (
    <div data-testid="card-file-icon" data-extension={extension ?? ''} />
  )
}))

vi.mock('sanity', async importOriginal => {
  const actual = await importOriginal<typeof import('sanity')>()
  return {
    ...actual,
    useColorSchemeValue: () => 'light'
  }
})

const imageAsset = {
  _id: 'img-1',
  _type: 'sanity.imageAsset',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r1',
  originalFilename: 'photo.png',
  size: 1,
  mimeType: 'image/png',
  url: 'https://example.com/photo.png',
  metadata: {dimensions: {width: 100, height: 100}, isOpaque: true}
} as ImageAsset

const fileAsset = {
  _id: 'file-1',
  _type: 'sanity.fileAsset',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r1',
  originalFilename: 'doc.pdf',
  extension: 'pdf',
  size: 1,
  mimeType: 'application/pdf',
  url: 'https://example.com/doc.pdf'
} as FileAsset

function assetItem(asset: ImageAsset | FileAsset, partial?: Partial<AssetItem>): AssetItem {
  return {
    _type: 'asset',
    asset,
    picked: false,
    updating: false,
    ...partial
  }
}

function assetsState(byIds: Record<string, AssetItem>, extra?: Partial<typeof assetsInitialState>) {
  return {
    ...assetsInitialState,
    assetTypes: ['file', 'image'] as AssetType[],
    allIds: Object.keys(byIds),
    byIds,
    ...extra
  }
}

function clickPreview() {
  const imgs = screen.getAllByTestId('card-image')
  const img = imgs.at(-1)
  if (!img) {
    throw new Error('card-image missing')
  }
  const target = img.parentElement
  if (!target) {
    throw new Error('preview wrapper missing')
  }
  return target
}

function clickFooterFilename(text: string) {
  const nodes = screen.getAllByText(text)
  const el = nodes.at(-1)
  if (!el) {
    throw new Error(`footer text missing: ${text}`)
  }
  return el
}

beforeEach(() => {
  setShiftPressed(false)
})

describe('CardAsset', () => {
  it('renders nothing when the asset id is not in the store', () => {
    renderWithProviders(<CardAsset id="missing" selected={false} />, {
      preloaded: {
        assets: assetsState({})
      }
    })
    expect(screen.queryAllByTestId('card-image')).toHaveLength(0)
    expect(screen.queryAllByTestId('card-file-icon')).toHaveLength(0)
  })

  it('renders image preview and original filename for an image asset', () => {
    renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset)})
      }
    })
    expect(screen.getAllByTestId('card-image').length).toBeGreaterThan(0)
    expect(screen.getAllByText('photo.png').length).toBeGreaterThan(0)
  })

  it('renders file icon with extension for a file asset', () => {
    renderWithProviders(<CardAsset id="file-1" selected={false} />, {
      preloaded: {
        assets: assetsState({'file-1': assetItem(fileAsset)})
      }
    })
    const icon = screen.getAllByTestId('card-file-icon').at(-1)!
    expect(icon).toHaveAttribute('data-extension', 'pdf')
    expect(screen.getAllByText('doc.pdf').length).toBeGreaterThan(0)
  })

  it('opens the asset edit dialog when the preview is clicked in browse mode', async () => {
    const user = userEvent.setup()
    const {store} = renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset)})
      }
    })

    await user.click(clickPreview())

    expect(
      store.getState().dialog.items.some(d => d.type === 'assetEdit' && d.assetId === 'img-1')
    ).toBe(true)
  })

  it('calls onSelect with the asset document id when the preview is clicked in picker mode', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      onSelect,
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset)})
      }
    })

    await user.click(clickPreview())

    expect(onSelect).toHaveBeenCalledWith([
      {
        kind: 'assetDocumentId',
        value: 'img-1'
      }
    ])
  })

  it('toggles pick when the footer is clicked in browse mode', async () => {
    const user = userEvent.setup()
    const {store} = renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset, {picked: false})})
      }
    })

    await user.click(clickFooterFilename('photo.png'))

    expect(store.getState().assets.byIds['img-1'].picked).toBe(true)
  })

  it('opens asset edit from the footer when in picker mode', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const {store} = renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      onSelect,
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset)})
      }
    })

    await user.click(clickFooterFilename('photo.png'))

    expect(onSelect).not.toHaveBeenCalled()
    expect(
      store.getState().dialog.items.some(d => d.type === 'assetEdit' && d.assetId === 'img-1')
    ).toBe(true)
  })

  it('shift-clicks on preview to unpick when the asset is already picked', async () => {
    const user = userEvent.setup()
    const {store} = renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset, {picked: true})})
      }
    })

    setShiftPressed(true)
    await user.click(clickPreview())
    setShiftPressed(false)

    expect(store.getState().assets.byIds['img-1'].picked).toBe(false)
  })

  it('shift-clicks on preview to pick a range when not picked and lastPicked is set', async () => {
    const user = userEvent.setup()
    const prevAsset = {...imageAsset, _id: 'prev-1', originalFilename: 'prev.png'} as ImageAsset
    const {store} = renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      preloaded: {
        assets: assetsState(
          {
            'prev-1': assetItem(prevAsset),
            'img-1': assetItem(imageAsset, {picked: false})
          },
          {lastPicked: 'prev-1'}
        )
      }
    })

    setShiftPressed(true)
    await user.click(clickPreview())
    setShiftPressed(false)

    expect(store.getState().assets.byIds['img-1'].picked).toBe(true)
    expect(store.getState().assets.byIds['prev-1'].picked).toBe(true)
  })

  it('shift-clicks on footer to pick a range when not picked', async () => {
    const user = userEvent.setup()
    const anchorAsset = {
      ...imageAsset,
      _id: 'anchor-9',
      originalFilename: 'anchor.png'
    } as ImageAsset
    const {store} = renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      preloaded: {
        assets: assetsState(
          {
            'anchor-9': assetItem(anchorAsset),
            'img-1': assetItem(imageAsset, {picked: false})
          },
          {lastPicked: 'anchor-9'}
        )
      }
    })

    setShiftPressed(true)
    await user.click(clickFooterFilename('photo.png'))
    setShiftPressed(false)

    expect(store.getState().assets.byIds['img-1'].picked).toBe(true)
    expect(store.getState().assets.byIds['anchor-9'].picked).toBe(true)
  })

  it('shows the selection checkmark when selected and not updating', () => {
    const {container} = renderWithProviders(<CardAsset id="img-1" selected />, {
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset, {updating: false})})
      }
    })
    expect(
      container.querySelectorAll('[data-sanity-icon="checkmark-circle"]').length
    ).toBeGreaterThan(0)
  })

  it('does not show the checkmark overlay while updating even if selected', () => {
    const {container} = renderWithProviders(<CardAsset id="img-1" selected />, {
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset, {updating: true})})
      }
    })
    expect(container.querySelectorAll('[data-sanity-icon="checkmark-circle"]')).toHaveLength(0)
  })

  it('shows a spinner while updating', () => {
    renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset, {updating: true})})
      }
    })
    expect(document.body.querySelectorAll('[data-ui="Spinner"]').length).toBeGreaterThan(0)
  })

  it('shows a warning icon when the asset item has an error', () => {
    const {container} = renderWithProviders(<CardAsset id="img-1" selected={false} />, {
      preloaded: {
        assets: assetsState({'img-1': assetItem(imageAsset, {error: 'Upload failed'})})
      }
    })
    expect(
      container.querySelectorAll('[data-sanity-icon="warning-filled"]').length
    ).toBeGreaterThan(0)
  })
})
